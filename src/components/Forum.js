import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

function Forum() {
  const [forumPosts, setForumPosts] = useState([]);
  const [newPost, setNewPost] = useState({ user: '', post: '' });
  const [editPostId, setEditPostId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'forumPosts'), (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setForumPosts(postsData);
    });
    return unsubscribe;
  }, []);

  const addPost = async () => {
    if (newPost.user && newPost.post) {
      try {
        if (editPostId !== null) {
          await updateDoc(doc(firestore, 'forumPosts', editPostId), newPost);
          setEditPostId(null);
        } else {
          await addDoc(collection(firestore, 'forumPosts'), newPost);
        }
        setNewPost({ user: '', post: '' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const editPost = (post) => {
    setNewPost({ user: post.user, post: post.post });
    setEditPostId(post.id);
  };

  const deletePost = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'forumPosts', id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="forum">
      <h2>Neighborhood Forum</h2>
      <ul>
        {forumPosts.map(post => (
          <li key={post.id} className="forum-post">
            <strong>{post.user}</strong>: {post.post}
            <button onClick={() => editPost(post)}>Edit</button>
            <button onClick={() => deletePost(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h3>{editPostId ? 'Edit Post' : 'Add New Post'}</h3>
      <div className="form-group">
        <input
          type="text"
          placeholder="Your name"
          value={newPost.user}
          onChange={e => setNewPost({ ...newPost, user: e.target.value })}
        />
      </div>
      <div className="form-group">
        <textarea
          placeholder="Your post"
          value={newPost.post}
          onChange={e => setNewPost({ ...newPost, post: e.target.value })}
        />
      </div>
      <button onClick={addPost}>{editPostId ? 'Update Post' : 'Add Post'}</button>
    </div>
  );
}

export default Forum;
