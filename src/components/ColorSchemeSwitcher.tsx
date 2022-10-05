import { ActionIcon, Group, useMantineColorScheme } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons";

export const ColorThemeSwitcher = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <Group onClick={() => toggleColorScheme()}>
      <ActionIcon
        variant="outline"
        color={dark ? "yellow" : "blue"}
        title="Toggle color scheme"
      >
        {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
      </ActionIcon>
      {dark ? "Enable light mode" : "Enable dark mode"}
    </Group>
  );
};
