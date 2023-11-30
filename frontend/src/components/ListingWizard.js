import React, { useEffect, useRef, useState } from "react";
import "./ListingWizard.css";
import { v4 as uuid } from "uuid";
import { supabase_client } from "../lib/supabase-client";
import { fileToBase64 } from "../lib/utils";

const ListingWizard = ({ isOpen, onClose, onSubmit, editListing }) => {
  const [formData, setFormData] = useState(
    editListing || {
      title: "",
      description: "",
      startingPrice: "",
      incrementAmount: "",
      images: [],
    }
  );

  useEffect(() => {
    setFormData({
      id: editListing.id || uuid(),
      user_id: editListing.user_id || undefined,
      title: editListing.title || "",
      description: editListing.description || "",
      start_price: editListing.start_price || "",
      increment: editListing.increment || "",
      images: editListing.images || [],
      finish_at: editListing.finish_at || new Date(),
    });
  }, [editListing]);

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
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = async (e) => {
    const { files } = e.target;

    const images = formData.images;

    for (const file of files) {
      const base64 = await fileToBase64(file);
      images.push(base64);
    }

    setFormData({ ...formData, images: images });
  };

  const removeImage = (index) => {
    formData.images.splice(index, 1);
    setFormData({ ...formData });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let { data, error } = await supabase_client
      .from("auction_listing")
      .upsert({
        id: formData.id,
        user_id: formData?.user_id ?? undefined,
        title: formData.title,
        description: formData.description,
        start_price: formData.start_price,
        increment: formData.increment,
        images: formData.images,
        finish_at: new Date(),
      })
      .select();

    if (onSubmit) onSubmit(formData);

    setFormData({
      id: uuid(),
      user_id: undefined,
      title: "",
      description: "",
      start_price: "",
      increment: "",
      images: [],
      finish_at: new Date(),
    });
    onClose();
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
            <h2>Create Auction Listing</h2>
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
            <div className="images">
              {formData.images.length > 0 ? (
                formData.images.map((image, index) => (
                  <div className="image" key={index}>
                    <img src={image} alt="An img" />
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
            <button type="submit" data-primary>
              {!editListing ? "Create Listing" : "Save Changes"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListingWizard;
