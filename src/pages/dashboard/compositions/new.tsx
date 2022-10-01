import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../../../utils/trpc";
import { newCompositionSchema } from "../../../utils/validations/compositions";

interface NewCompositionData {
  name: string;
  description: string;
}

const NewCompositionForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewCompositionData>({
    resolver: zodResolver(newCompositionSchema),
  });

  const mutation = trpc.useMutation("dashboardCompositions.create");
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    await mutation.mutate(data);

    router.push("/dashboard/compositions");
  });

  return (
    <form onSubmit={onSubmit}>
      <input {...register("name")} placeholder="Name" />
      <p>{errors.name?.message}</p>
      <input {...register("description")} placeholder="Description" />
      <p>{errors.description?.message}</p>
      <button>Create new composition</button>
    </form>
  );
};

const NewCompositionPage = () => {
  return (
    <div>
      <h1>Create new composition</h1>
      <NewCompositionForm />
    </div>
  );
};

export default NewCompositionPage;
