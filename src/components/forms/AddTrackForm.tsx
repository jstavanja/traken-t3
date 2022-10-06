import {
  Stack,
  TextInput,
  Button,
  useMantineTheme,
  Group,
  Text,
} from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { IconUpload, IconX, IconFileMusic } from "@tabler/icons";
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

  const utils = trpc.useContext();

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

    form.reset();

    utils.invalidateQueries([
      "dashboardCompositions.get",
      {
        id: compositionId,
      },
    ]);
  });

  const theme = useMantineTheme();

  const setFileIntoValues = (files: FileWithPath[]) => {
    if (files.length === 0) return;
    form.setFieldValue("file", files[0]);
  };

  return (
    <form onSubmit={onTrackAddSubmit}>
      <Stack>
        <TextInput
          label="Name"
          placeholder="Vocals, guitar, ..."
          {...form.getInputProps("name")}
        />
        <Dropzone
          maxSize={10 * 1024 ** 2}
          maxFiles={1}
          onDrop={setFileIntoValues}
          {...form.getInputProps("file")}
          accept={["audio/mpeg"]}
        >
          <Group
            position="center"
            spacing="xl"
            style={{ minHeight: 220, pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <IconUpload
                size={50}
                stroke={1.5}
                color={
                  theme.colors[theme.primaryColor]?.[
                    theme.colorScheme === "dark" ? 4 : 6
                  ]
                }
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                size={50}
                stroke={1.5}
                color={theme.colors.red?.[theme.colorScheme === "dark" ? 4 : 6]}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              {!form.errors["file"] && <IconFileMusic size={50} stroke={1.5} />}
              {form.errors["file"] && (
                <IconX
                  size={50}
                  stroke={1.5}
                  color={
                    theme.colors.red?.[theme.colorScheme === "dark" ? 4 : 6]
                  }
                />
              )}
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                {form.values["file"] && !form.errors["file"] && (
                  <span>Adding file: {form.values["file"].name}</span>
                )}
                {!form.values["file"] && !form.errors["file"] && (
                  <span>
                    Drag track here or click to select .mp3 files. Filesize
                    cannot exceed 10MB.
                  </span>
                )}
                {form.errors["file"] && (
                  <Text
                    color={
                      theme.colors.red?.[theme.colorScheme === "dark" ? 4 : 6]
                    }
                  >
                    {form.errors["file"]}
                  </Text>
                )}
              </Text>
              <Text size="sm" color="dimmed" inline mt={7}>
                {!form.errors["file"] && (
                  <Text>Click to upload a different file.</Text>
                )}
              </Text>
            </div>
          </Group>
        </Dropzone>

        <Button type="submit">Upload track</Button>
      </Stack>
    </form>
  );
};
