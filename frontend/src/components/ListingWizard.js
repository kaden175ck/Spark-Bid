import React, { useState } from "react";
import "./ListingWizard.css";
import { supabase_client } from "../lib/supabase-client";
import { fileToBase64 } from "../lib/utils";

const ListingWizard = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startingPrice: "",
    incrementAmount: "",
    images: [],
  });

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormData({ ...formData, [name]: [...files] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.images || formData.images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    let { data, error } = await supabase_client
      .from("auction_listing")
      .insert({
        title: formData.title,
        description: formData.description,
        start_price: formData.startingPrice,
        increment: formData.incrementAmount,
        finish_at: new Date(),
      })
      .select();

    if (!error && data?.length > 0) {
      const added_listing = data[0];
      console.log(added_listing);
      for (let file of formData.images) {
        const file_name = file.name;
        const base64 = await fileToBase64(file);
        let { data, error } = await supabase_client
          .from("images")
          .insert({
            file_name,
            base64,
          })
          .select();

        if (error || data?.length === 0) {
          console.error(error);
        } else {
          const added_image = data[0];
          await supabase_client.from("images_for_listing").insert({
            listing_id: added_listing.id,
            image_id: added_image.id,
          });
        }
      }
    }

    if (onSubmit) onSubmit(formData);

    setFormData({
      title: "",
      description: "",
      startingPrice: "",
      incrementAmount: "",
      images: [],
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
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <h2>Create Auction Listing</h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required // Make title required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              // Description is not required
            />
            <input
              type="number"
              name="startingPrice"
              placeholder="Starting Price"
              value={formData.startingPrice}
              onChange={handleChange}
              required // Make starting price required
            />
            <input
              type="number"
              name="incrementAmount"
              placeholder="Increment Amount"
              value={formData.incrementAmount}
              onChange={handleChange}
              required // Make increment amount required
            />
            <input
              type="file"
              name="images"
              multiple
              onChange={handleChange}
              accept="image/*" // Accept only image files
              required // Make image upload required
            />
            <button type="submit">Create Listing</button>
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
