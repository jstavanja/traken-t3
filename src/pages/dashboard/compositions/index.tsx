import { Button, Container, Group, Title } from "@mantine/core";
import Link from "next/link";
import AuthGuard from "../../../components/AuthGuard";
import { CompositionsGrid } from "../../../components/compositions/CompositionsGrid";
import AuthError from "../../../components/dashboard/AuthError";
import { trpc } from "../../../utils/trpc";

const CompositionsListPage = () => {
  const { data: compositions } = trpc.useQuery([
    "dashboardCompositions.getAll",
  ]);

  return (
    <AuthGuard CustomError={AuthError}>
      <Container>
        <Group position="apart">
          <Title>Your Compositions</Title>
          <Link href={"/dashboard/compositions/new"}>
            <Button>Add new composition</Button>
          </Link>
        </Group>
        {compositions && (
          <CompositionsGrid
            compositions={compositions}
            clickLeadsToEdit={true}
          />
        )}
      </Container>
    </AuthGuard>
  );
};

export default CompositionsListPage;
