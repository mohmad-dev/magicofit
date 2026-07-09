import { useState, useEffect } from "react";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight, Trash } from "@medusajs/icons";
import { Container, Heading, Table, Button, Text } from "@medusajs/ui";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

const ContactMessagesPage = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/admin/contact-messages", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch messages.");
      }
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }
    try {
      const res = await fetch(`/admin/contact-messages?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete message.");
      }
      // Reload messages
      fetchMessages();
    } catch (err: any) {
      alert(err.message || "Failed to delete message.");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <Container className="flex flex-col gap-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h1">Contact Messages</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Manage inquiries and messages submitted by customers through the storefront Contact page.
          </Text>
        </div>
        <Button variant="secondary" onClick={fetchMessages} isLoading={isLoading}>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-ui-fg-muted">
          Loading messages...
        </div>
      ) : messages.length === 0 ? (
        <div className="flex items-center justify-center p-12 border border-dashed rounded-lg text-ui-fg-muted">
          No contact messages found.
        </div>
      ) : (
        <div className="border border-ui-border-base rounded-lg overflow-hidden">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Sender</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Subject</Table.HeaderCell>
                <Table.HeaderCell>Message</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {messages.map((msg) => (
                <Table.Row key={msg.id}>
                  <Table.Cell className="font-semibold">{msg.name}</Table.Cell>
                  <Table.Cell>{msg.email}</Table.Cell>
                  <Table.Cell className="font-medium text-ui-fg-interactive">{msg.subject}</Table.Cell>
                  <Table.Cell className="max-w-md truncate" title={msg.message}>
                    {msg.message}
                  </Table.Cell>
                  <Table.Cell className="text-ui-fg-subtle">
                    {new Date(msg.created_at).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <Button
                      variant="transparent"
                      size="small"
                      onClick={() => handleDelete(msg.id)}
                      className="text-red-500 hover:text-red-700 inline-flex items-center gap-1"
                    >
                      <Trash className="h-4 w-4" />
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Contact Messages",
  icon: ChatBubbleLeftRight,
});

export default ContactMessagesPage;
