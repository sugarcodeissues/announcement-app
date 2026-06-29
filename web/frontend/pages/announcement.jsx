import { useState } from "react";
import {
    Page,
    Layout,
    Card,
    TextField,
    Button,
    Banner,
    Text,
    TextContainer,
} from "@shopify/polaris";
import { TitleBar} from "@shopify/app-bridge-react";
import { useMutation } from "react-query";

export default function AnnouncementPage() {
    const [announcement_text, set_announcement_text] = useState("");
    const [show_success, set_show_success] = useState(false);

    const save_mutation = useMutation(
        async () => {
const response = await fetch("/api/announcement", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
        text: announcement_text,
    }),
});


const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to save announcement");
            }
            return data;
        },
        {
            onSuccess: () => set_show_success(true),
            onError: () => set_show_success(false),
        }
    );

    const handle_save = () => {
        set_show_success(false);
        save_mutation.mutate();
    };

    return (
        <Page>
            <TitleBar title="Announcement Banner" />
            <Layout>
                <Layout.Section>
                    {show_success && (
                        <Banner
                            title="Announcement saved"
                            status="success"
                            onDismiss={() => set_show_success(false)}
                        >
                            <p>
                                Your announcement has been saved and the shop metafield has been updated.
                                Enable the App Embed Block in your theme to display it.
                            </p>
                        </Banner>
                    )}
                    {save_mutation.isError && (
                        <Banner
                            title="Error saving announcement"
                            status="critical"
                            onDismiss={() => save_mutation.reset()}
                        >
                            <p>{save_mutation.error?.message}</p>
                        </Banner>
                    )}
                    <Card sectioned>
                        <Text variant="headingMd" as="h2">
                            Announcement Text
                        </Text>
                        <TextContainer>
                            <p>
                                Enter the text to display as a banner across your storefront.
                                This text is saved to your database and synced to a shop metafield.
                            </p>
                        </TextContainer>
                        <div style={{ marginTop: "16px" }}>
                            <TextField
                                label="Announcement"
                                value={announcement_text}
                                onChange={set_announcement_text}
                                placeholder="e.g. Free shipping on orders over $50!"
                                multiline={3}
                                autoComplete="off"
                            />
                        </div>
                        <div style={{ marginTop: "16px" }}>
                            <Button
                                primary
                                onClick={handle_save}
                                loading={save_mutation.isLoading}
                                disabled={!announcement_text.trim()}
                            >
                                Save Announcement
                            </Button>
                        </div>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}