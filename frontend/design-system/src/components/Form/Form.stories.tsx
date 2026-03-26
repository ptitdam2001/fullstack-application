import type { Meta, StoryObj } from "@storybook/react-vite";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormField } from "./Form";
import { FormControl } from "./FormControl";
import { FormDescription } from "./FormDescription";
import { FormItem } from "./FormItem";
import { FormLabel } from "./FormLabel";
import { FormMessage } from "./FormMessage";

const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
});

const meta = {
  component: Form,
} satisfies Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof meta>;

function FormExample() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="w-64 space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <input
                  className="border rounded px-3 py-1.5 text-sm w-full"
                  placeholder="Enter username"
                  {...field}
                />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded w-full">
          Submit
        </button>
      </form>
    </Form>
  );
}

export const Default: Story = {
  render: () => <FormExample />,
};

export const WithValidationError: Story = {
  render: () => {
    function ErrorExample() {
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { username: "" },
      });

      return (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => {})}
            className="w-64 space-y-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <input className="border rounded px-3 py-1.5 text-sm w-full" placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button type="submit" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded w-full">
              Submit (triggers validation)
            </button>
          </form>
        </Form>
      );
    }
    return <ErrorExample />;
  },
};
