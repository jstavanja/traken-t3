import { Stack, TextInput, Button } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import { newCompositionSchema } from '../../utils/validations/compositions';

interface NewCompositionData {
  name: string;
  description: string;
}

export const NewCompositionForm = () => {
  const form = useForm<NewCompositionData>({
    validate: zodResolver(newCompositionSchema),
    initialValues: {
      name: '',
      description: '',
    },
  });

  const { mutate, error } = trpc.useMutation('dashboardCompositions.create', {
    onSuccess: () => {
      showNotification({
        title: 'Composition created.',
        message: 'Your new composition was created successfully! 🎼',
        autoClose: 3000,
        color: 'green',
        icon: <IconCheck />,
      });
      router.push('/dashboard/compositions');
    },
    onError: () => {
      showNotification({
        title: 'Cannot create composition.',
        message: error?.message ?? 'Something went wrong. Please try again.',
        autoClose: 3000,
        color: 'red',
        icon: <IconX />,
      });
    },
  });
  const router = useRouter();

  const onSubmit = form.onSubmit((data) => {
    mutate(data);
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <TextInput
          label="Name"
          placeholder="Cool song"
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Description"
          placeholder="This is my new cool jam!"
          {...form.getInputProps('description')}
        />
        <Button type="submit">Create new composition</Button>
      </Stack>
    </form>
  );
};
