import { Stack, TextInput, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { newCompositionSchema } from "../../utils/validations/compositions";

interface NewCompositionData {
  name: string;
  description: string;
}

export const NewCompositionForm = () => {
  const form = useForm<NewCompositionData>({
    validate: zodResolver(newCompositionSchema),
    initialValues: {
      name: "",
      description: "",
    },
  });

  const mutation = trpc.useMutation("dashboardCompositions.create");
  const router = useRouter();

  const onSubmit = form.onSubmit(async (data) => {
    await mutation.mutate(data);

    showNotification({
      title: "Composition created.",
      message: "Your new composition was created successfully! 🎼",
      autoClose: 3000,
      color: "green",
      icon: <IconCheck />,
    });

    router.push("/dashboard/compositions");
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <TextInput
          label="Name"
          placeholder="Cool song"
          {...form.getInputProps("name")}
        />
        {form.errors.name && <p>{form.errors.name}</p>}
        <TextInput
          label="Description"
          placeholder="This is my new cool jam!"
          {...form.getInputProps("description")}
        />
        {form.errors.description && <p>{form.errors.description}</p>}
        <Button type="submit">Create new composition</Button>
      </Stack>
    </form>
  );
};
