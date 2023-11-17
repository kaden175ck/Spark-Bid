const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

const getItems = async (req, res) => {
    try {
        let { data, error } = await supabase
            .from('items')
            .select('*');
        
        if (error) throw error;
        
        res.json(data);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const createItem = async (req, res) => {
    const { seller_id, name, description, start_price, image_url } = req.body;
    try {
        let { data, error } = await supabase
            .from('items')
            .insert([{ seller_id, name, description, start_price, image_url }]);
        
        if (error) throw error;
        
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const getItem = async (req, res) => {
    const { id } = req.params;
    try {
        let { data, error } = await supabase
            .from('items')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        
        res.json(data);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const updateItem = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        let { data, error } = await supabase
            .from('items')
            .update(updates)
            .eq('id', id);
        
        if (error) throw error;
        
        res.json(data[0]);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const deleteItem = async (req, res) => {
    const { id } = req.params;
    try {
        let { data, error } = await supabase
            .from('items')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        res.send({ message: "Item deleted successfully." });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

module.exports = {
    getItems,
    createItem,
    getItem,
    updateItem,
    deleteItem
};
