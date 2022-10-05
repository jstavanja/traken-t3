import { Stack, TextInput, FileInput, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { FC } from "react";
import { trpc } from "../../utils/trpc";
import { newTrackSchema } from "../../utils/validations/track";

interface AddTrackFormProps {
  compositionId: string;
}

interface NewTrackFormValues {
  name: string;
  file?: File;
}

export const AddTrackForm: FC<AddTrackFormProps> = ({ compositionId }) => {
  const form = useForm<NewTrackFormValues>({
    validate: zodResolver(newTrackSchema),
    initialValues: {
      name: "",
    },
  });

  const { mutateAsync: newTrackMutation } = trpc.useMutation(
    "tracks.createAndGetFilename"
  );

  const onTrackAddSubmit = form.onSubmit(async (values) => {
    if (!values.file) return;

    const newTrack = await newTrackMutation({
      name: values.name,
      compositionId,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, any> = {
      ...newTrack.trackUploadInfo.fields,
      "Content-Type": "audio/mpeg",
    };

    const formData = new FormData();

    for (const name in data) {
      formData.append(name, data[name]);
    }

    formData.append("file", values.file);

    await fetch(newTrack.trackUploadInfo.url, {
      method: "POST",
      body: formData,
    });
  });

  return (
    <form onSubmit={onTrackAddSubmit}>
      <Stack>
        <TextInput
          label="Name"
          placeholder="Vocals, guitar, ..."
          {...form.getInputProps("name")}
        />
        <FileInput
          accept="audio/mpeg"
          {...form.getInputProps("file")}
          placeholder="File"
        />
        <Button type="submit">Upload track</Button>
      </Stack>
    </form>
  );
};
