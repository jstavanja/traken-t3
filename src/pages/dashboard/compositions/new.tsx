import { useRouter } from "next/router";
import { useForm, zodResolver } from "@mantine/form";
import { trpc } from "../../../utils/trpc";
import { newCompositionSchema } from "../../../utils/validations/compositions";
import AuthError from "../../../components/dashboard/AuthError";
import AuthGuard from "../../../components/AuthGuard";
import { Button, Container, Stack, Title } from "@mantine/core";
import { TextInput } from "../../../components/blocks/TextInput";
import Head from "next/head";

interface NewCompositionData {
  name: string;
  description: string;
}

const NewCompositionForm = () => {
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

const NewCompositionPage = () => {
  return (
    <>
      <Head>
        <title>Traken - Create a new composition</title>
      </Head>
      <AuthGuard CustomError={AuthError}>
        <Container>
          <Title size="h1">Create new composition</Title>
          <NewCompositionForm />
        </Container>
      </AuthGuard>
    </>
  );
};

export default NewCompositionPage;
