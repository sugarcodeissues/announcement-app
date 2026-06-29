import { Router } from 'express';
import Announcement from '../models/Announcement.js';
import shopify from '../shopify.js';

const router = Router();

router.post('/', async (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Announcement text is required',
        });
    }

    const trimmed_text = text.trim();
    const session = res.locals.shopify.session;

    try {
        // 1. Persist to MongoDB — audit history entry
        await new Announcement({
            shop: session.shop,
            text: trimmed_text,
            created_at: new Date(),
        }).save();

        const client = new shopify.api.clients.Graphql({ session });

        // 2. Get shop GID — required as ownerId for shop-level metafields
        const shop_response = await client.request(`
            query {
                shop {
                    id
                }
            }
        `);

        const shop_gid = shop_response.data.shop.id;

        // 3. Write shop metafield via Admin GraphQL
        const metafield_response = await client.request(`
            mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
                metafieldsSet(metafields: $metafields) {
                    metafields {
                        key
                        namespace
                        value
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `, {
            variables: {
                metafields: [
                    {
                        namespace: 'my_app',
                        key: 'announcement',
                        value: trimmed_text,
                        type: 'single_line_text_field',
                        ownerId: shop_gid,
                    },
                ],
            },
        });

        const user_errors = metafield_response.data?.metafieldsSet?.userErrors;
        if (user_errors && user_errors.length > 0) {
            return res.status(422).json({
                success: false,
                error: user_errors[0].message,
            });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('[Announcement] Error:', error.message);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

export default router;