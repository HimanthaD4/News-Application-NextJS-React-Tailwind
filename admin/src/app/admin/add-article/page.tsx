"use client"
import React, { useState } from 'react';
import axios from 'axios'; 
import Sidebar from '@/components/Admin/Sidebar';
import { MdAddAPhoto } from 'react-icons/md';
import Swal from 'sweetalert2';
import Header from '@/components/Admin/Header';
import auth from '@/utils/withAuth';

const Add = () => {
  const [articleHead, setArticleHead] = useState('');
  const [articleDescription, setArticleDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArticleHeadChange = (e) => {
    setArticleHead(e.target.value);
  };

  const handleArticleDescriptionChange = (e) => {
    setArticleDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (!articleHead || !articleDescription || !selectedImage) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'All fields are required',
      });
      return;
    }
    setUploading(true);
  
    const formData = new FormData();
    formData.append('articleHead', articleHead);
    formData.append('articleDescription', articleDescription);
    formData.append('image', e.target.image.files[0]); // Make sure input field has name="image"
  
    try {
      const response = await axios.post('http://localhost:5000/api/articles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploading(false);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Article added successfully',
      });
      setArticleHead('');
      setArticleDescription('');
      setSelectedImage(null);
    } catch (error) {
      console.error(error);
      setUploading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add article. Please try again later.',
      });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <Sidebar />
     
      <div className="ml-64 px-4 py-24"> 
        <div className="max-w-2xl mx-auto">
         
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label htmlFor="title" className="text-lg font-medium text-gray-800">Title</label>
                <input id="title" name="title" type="text" className="border border-gray-300 rounded-md px-4 py-3" value={articleHead} onChange={handleArticleHeadChange} />
              </div>

              <div className="flex flex-col">
                <label htmlFor="image" className="text-lg font-medium flex items-center text-gray-800">
                  <MdAddAPhoto className="mr-2 text-accent" /> Image
                </label>
                <div className="relative border-2 border-gray-300 rounded-md px-4 py-3 focus-within:ring focus-within:border-accent-light overflow-hidden">
                  <input type="file" id="image" name="image" accept="image/*" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" onChange={handleImageChange} />
                  <div>
                    {selectedImage && (
                      <img
                        src={selectedImage}
                        alt="Uploaded"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    )}
                    {!selectedImage && (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-gray-600">Upload an image for your article</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="content" className="text-lg font-medium text-gray-800">Content</label>
                <textarea id="content" name="content" rows="6" className="border border-gray-300 rounded-md px-4 py-3" value={articleDescription} onChange={handleArticleDescriptionChange}></textarea>
              </div>

              <button type="submit" className="bg-[#FA2E56] text-white px-6 py-3 rounded-md hover:bg-accent-dark transition duration-300" disabled={uploading}>
                {uploading ? 'Adding...' : 'Add Article'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default auth(Add);