import { createStyles, Card, Container, SimpleGrid, Text } from "@mantine/core";
import { Composition } from "@prisma/client";
import Link from "next/link";
import { FC } from "react";

const useStyles = createStyles((theme) => ({
  card: {
    transition: "transform 150ms ease, box-shadow 150ms ease",
    boxShadow: theme.shadows.xs,

    "&:hover": {
      transform: "scale(1.01)",
      boxShadow: theme.shadows.md,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 600,
  },
}));

interface CompositionsGridProps {
  compositions: Composition[];
  clickLeadsToEdit?: boolean;
}

export const CompositionsGrid: FC<CompositionsGridProps> = ({
  compositions,
  clickLeadsToEdit,
}) => {
  const { classes } = useStyles();

  const cards = compositions.map((composition) => {
    const link = clickLeadsToEdit
      ? `/dashboard/compositions/${composition.id}`
      : `/explore/${composition.id}`;
    return (
      <Link href={link} key={composition.name}>
        <Card
          p="md"
          radius="md"
          component="a"
          href="#"
          className={classes.card}
        >
          <Text className={classes.title} mt={5}>
            {composition.name}
          </Text>
          <Text color="dimmed" size="xs" weight={700} mt="md">
            {composition.description}
          </Text>
        </Card>
      </Link>
    );
  });

  return (
    <Container py="xl">
      <SimpleGrid cols={1} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
        {cards}
      </SimpleGrid>
    </Container>
  );
};
