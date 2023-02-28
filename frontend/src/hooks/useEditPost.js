import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { EditPostService, getSinglePostService } from "../Services";

const useEditPost = (id) => {
  const { token } = useContext(AuthContext);

  const [post, setPost] = useState();
  const [imagePreview, setImagePreview] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCurrentPost = async () => {
      try {
        const currentPost = await getSinglePostService(id);
        if (currentPost) {
          setPost(currentPost);
          setImagePreview(
            currentPost.image
              ? `${process.env.REACT_APP_BACKEND}/uploads/newsImages/${currentPost.image}`
              : ""
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadCurrentPost();
  }, [id]);

  const handleChange = ({ target }) => {
    setPost({
      ...post,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(post);
    try {
      await EditPostService(post, token, id);
      navigate(`/new/${id}`);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleFile = ({ target }) => {
    const imputImage = target.files[0];
    setPost({
      ...post,
      image: imputImage,
    });
    setImagePreview(URL.createObjectURL(imputImage));

    //converto fichero en ruta con URL.createObjectURL(file)
  };
  return { post, handleChange, handleSubmit, handleFile, imagePreview };
};
export default useEditPost;
