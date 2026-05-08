import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { getUserById, updateUser } from '../data/users.ts';
import Preview from './Preview.tsx';

const userId = '69fde0834e2fc2f75bf7a7ed';

const EditForm = () => {
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
    // image: ''
  });

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const userData = await getUserById(userId);
        if (!ignore) {
          const { firstName, lastName, email, image } = userData;
          setForm({ firstName, lastName, email });
          setImagePreview(image);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Something went wrong');
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'image') {
      setImagePreview(e.target.value);
    }
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData(e.currentTarget);
      // formData.append("firstName", form.firstName)
      // formData.append("image", )
      //
      // console.log(Object.fromEntries(formData));

      const { firstName, lastName, email, image } = await updateUser({
        id: userId,
        formData
      });

      setImagePreview(image);

      setForm({ firstName, lastName, email });
      toast.success('Profile updated');
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-center text-4xl">File upload</h1>
      <form className="mx-auto mt-5 flex w-1/2 flex-col items-center gap-5" onSubmit={handleSubmit}>
        <label className="input input-bordered flex w-full items-center gap-2">
          First Name:
          <input
            value={form.firstName}
            onChange={handleChange}
            type="text"
            name="firstName"
            className="grow"
          />
        </label>
        <label className="input input-bordered flex w-full items-center gap-2">
          Last Name:
          <input
            value={form.lastName}
            onChange={handleChange}
            type="text"
            name="lastName"
            className="grow"
          />
        </label>
        <label className="input input-bordered flex w-full items-center gap-2">
          Email:
          <input
            value={form.email}
            onChange={handleChange}
            type="text"
            name="email"
            className="grow"
          />
        </label>

        {/*<label className="input input-bordered flex items-center gap-2 w-full">
          Image:
          <input
            value={form.image}
            onChange={handleChange}
            type="text"
            name="image"
            className="grow"
          />
        </label>*/}

        <input
          type="file"
          name="image"
          className="file-input input-bordered w-full"
          onChange={e => {
            setImagePreview(URL.createObjectURL(e.target.files![0])); // In-Browser Preview
          }}
        />

        <button type="submit" className="btn btn-block" disabled={loading}>
          Upload
        </button>
      </form>
      {imagePreview && <Preview image={imagePreview} />}
    </div>
  );
};

export default EditForm;
