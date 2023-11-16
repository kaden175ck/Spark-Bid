const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

const itemController = {
    // Create a new item listing
    createItem: async (req, res) => {
        const { title, description, imageUrl, startingBid, sellerId } = req.body;

        if (!title || !description || !startingBid || !sellerId) {
            return res.status(400).send({ message: 'Missing required fields' });
        }

        try {
            const { data, error } = await supabase
                .from('items')
                .insert([{ title, description, imageUrl, startingBid, sellerId }]);

            if (error) throw error;

            res.status(201).send(data);
        } catch (error) {
            console.error('Error creating item:', error);
            res.status(500).send({ message: error.message });
        }
    },

    // Retrieve a specific item by ID
    getItemById: async (req, res) => {
        const { id } = req.params;

        try {
            const { data, error } = await supabase
                .from('items')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            res.status(200).send(data);
        } catch (error) {
            console.error('Error fetching item:', error);
            res.status(500).send({ message: error.message });
        }
    },

    // Update an item listing
    updateItem: async (req, res) => {
        const { id } = req.params;
        const updates = req.body;

        try {
            const { data, error } = await supabase
                .from('items')
                .update(updates)
                .match({ id });

            if (error) throw error;

            res.status(200).send(data);
        } catch (error) {
            console.error('Error updating item:', error);
            res.status(500).send({ message: error.message });
        }
    },

    // Delete an item listing
    deleteItem: async (req, res) => {
        const { id } = req.params;

        try {
            const { data, error } = await supabase
                .from('items')
                .delete()
                .match({ id });

            if (error) throw error;

            res.status(200).send(data);
        } catch (error) {
            console.error('Error deleting item:', error);
            res.status(500).send({ message: error.message });
        }
    }
};

module.exports = itemController;
