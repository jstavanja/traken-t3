import { Stack, TextInput, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { Composition } from "@prisma/client";
import { IconCheck } from "@tabler/icons";
import { FC } from "react";
import { trpc } from "../../utils/trpc";
import { editCompositionSchema } from "../../utils/validations/compositions";

interface EditCompositionFormProps {
  currentCompositionData: Composition;
}

export const EditCompositionForm: FC<EditCompositionFormProps> = ({
  currentCompositionData,
}) => {
  const form = useForm({
    validate: zodResolver(editCompositionSchema),
    initialValues: currentCompositionData,
  });

  const { mutateAsync: editCompositionMutation } = trpc.useMutation(
    "dashboardCompositions.edit"
  );

  const utils = trpc.useContext();

  const onEditCompositionSubmit = form.onSubmit(async (values) => {
    await editCompositionMutation(
      {
        description: values.description,
        id: currentCompositionData.id,
        name: values.name,
      },
      {
        onSuccess: () => {
          utils.invalidateQueries([
            "dashboardCompositions.get",
            {
              id: currentCompositionData.id,
            },
          ]);

          showNotification({
            title: "Composition edited",
            message: "The data of the composition was succesfully edited! ✏️",
            autoClose: 3000,
            color: "green",
            icon: <IconCheck />,
          });
        },
      }
    );
  });

  return (
    <form onSubmit={onEditCompositionSubmit}>
      <Stack>
        <TextInput
          label="Name"
          placeholder="Cool composition"
          {...form.getInputProps("name")}
        />
        {form.errors.name && <p>{form.errors.name}</p>}
        <TextInput
          label="Description"
          placeholder="Some split tracks for you to jam along."
          {...form.getInputProps("description")}
        />
        {form.errors.description && <p>{form.errors.description}</p>}
        <Button type="submit">Edit composition</Button>
      </Stack>
    </form>
  );
};
