import React, { useEffect, useRef, useState } from "react";
import "./ListingWizard.css";
import { v4 as uuid } from "uuid";
import { supabase_client } from "../lib/supabase-client";
import {
  compressImage,
  formatDateForLocal,
  getPublicUrl,
  toUTCFormat,
} from "../lib/utils";
import useAuth from "../lib/auth-hook";

const ListingWizard = ({ isOpen, onClose, onSubmit, editListing }) => {
  const { session, loading } = useAuth();
  const user_id = session?.user?.id;

  const [formData, setFormData] = useState(
    editListing || {
      title: "",
      description: "",
      startingPrice: "",
      incrementAmount: "",
      image_ids: [],
    }
  );

  useEffect(() => {
    setFormData({
      id: editListing.id || uuid(),
      user_id: editListing.user_id || user_id,
      title: editListing.title || "",
      description: editListing.description || "",
      start_price: editListing.start_price || "",
      increment: editListing.increment || "",
      image_ids: editListing.image_ids || [],
      finish_at: editListing.finish_at
        ? formatDateForLocal(editListing.finish_at)
        : new Date().toISOString().slice(0, 16),
    });
  }, [editListing, user_id]);

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    // Trigger the hidden file input click event
    fileInputRef.current.click();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "finish_at") {
      setFormData({ ...formData, [name]: toUTCFormat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileUpload = async (e) => {
    const { files } = e.target;

    const images = formData.image_ids;

    for (const file of files) {
      const compressedImage = await compressImage(file);
      const image_id = uuid();
      const { error } = await supabase_client.storage
        .from("images")
        .upload(`${formData.user_id}/${image_id}.jpg`, compressedImage, {
          upsert: false,
        });
      if (error) console.error(error);
      else images.push(image_id);
    }

    setFormData({ ...formData, image_ids: images });
    let { data, error } = await saveToDatabase();
    if (error) console.error(error);
  };

  const removeImage = async (index) => {
    const image_id = formData.image_ids[index];
    const { error } = await supabase_client.storage
      .from("images")
      .remove([`${formData.user_id}/${image_id}.jpg`]);

    if (error) {
      console.error(error);
    } else {
      formData.image_ids.splice(index, 1);
      setFormData({ ...formData });
      let { data, error } = await saveToDatabase();
      if (error) console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let { data, error } = await saveToDatabase();

    if (onSubmit) onSubmit(formData);

    setFormData({
      id: uuid(),
      user_id: undefined,
      title: "",
      description: "",
      start_price: "",
      increment: "",
      image_ids: [],
      finish_at: new Date(),
    });
    onClose();
  };

  const saveToDatabase = async () => {
    let { data, error } = await supabase_client
      .from("auction_listing")
      .upsert({
        id: formData.id,
        user_id: formData?.user_id ?? undefined,
        title: formData.title,
        description: formData.description,
        start_price: formData.start_price,
        increment: formData.increment,
        image_ids: formData.image_ids,
        finish_at: formData.finish_at,
      })
      .select();
    return { data, error };
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={stopPropagation}>
        <span className="close-modal" onClick={onClose}>
          &times;
        </span>
        <div className="listing-modal">
          <form onSubmit={handleSubmit}>
            <h2>{editListing ? "Edit" : "Create"} Auction Listing</h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleFormChange}
              required // Make title required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleFormChange}
              // Description is not required
            />
            <input
              type="number"
              name="startingPrice"
              placeholder="Starting Price"
              value={formData.start_price}
              onChange={handleFormChange}
              required // Make starting price required
            />
            <input
              type="number"
              name="incrementAmount"
              placeholder="Increment Amount"
              value={formData.increment}
              onChange={handleFormChange}
              required // Make increment amount required
            />
            <input
              type="datetime-local"
              name="finish_at"
              value={formatDateForLocal(formData.finish_at)}
              onChange={handleFormChange}
              required
            />
            <div className="images">
              {formData.image_ids.length > 0 ? (
                formData.image_ids.map((image_id, index) => (
                  <div className="image" key={index}>
                    <img
                      src={getPublicUrl(formData.user_id, image_id)}
                      alt="An img"
                    />
                    <button onClick={() => removeImage(index)}>
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                ))
              ) : (
                <p>You have no images</p>
              )}
            </div>
            <button type="button" onClick={triggerFileInput}>
              Upload Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }} // Hide the file input
              name="images"
              multiple
              onChange={handleFileUpload}
              accept="image/*" // Accept only image files
            />
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" data-primary>
              {!editListing ? "Create Listing" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListingWizard;
