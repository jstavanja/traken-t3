import { Group, TextInput, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { Track } from "@prisma/client";
import { IconCheck } from "@tabler/icons";
import { FC } from "react";
import { trpc } from "../../utils/trpc";
import { editTrackSchema } from "../../utils/validations/track";

interface EditTrackNameFormProps {
  track: Track;
  compositionId: string;
  onSuccessfulTrackEdit: () => void;
}

export const EditTrackNameForm: FC<EditTrackNameFormProps> = ({
  track,
  compositionId,
  onSuccessfulTrackEdit,
}) => {
  const form = useForm({
    validate: zodResolver(editTrackSchema),
    initialValues: track,
  });

  const { mutateAsync: editTrackMutation } = trpc.useMutation("tracks.edit");

  const utils = trpc.useContext();

  const onEditTrackSubmit = form.onSubmit(async (values) => {
    await editTrackMutation({
      name: values.name,
      compositionId,
      id: track.id,
    });

    utils.invalidateQueries([
      "dashboardCompositions.get",
      {
        id: compositionId,
      },
    ]);

    showNotification({
      title: "Track name edited",
      message: "The track name was succesfully updated! 🔧",
      autoClose: 3000,
      color: "green",
      icon: <IconCheck />,
    });

    onSuccessfulTrackEdit();
  });
  return (
    <form onSubmit={onEditTrackSubmit}>
      <Group>
        <Group>
          <TextInput
            label="Name"
            placeholder="Vocals, guitar, ..."
            {...form.getInputProps("name")}
          />
          {form.errors.name && <p>{form.errors.name}</p>}
        </Group>
        <Button type="submit">Edit</Button>
      </Group>
    </form>
  );
};
