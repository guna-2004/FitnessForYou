import { useEffect, useState } from "react";
import { addFood, getFood } from "../api";

const Dashboard = () => {
    const [foods, setFoods] = useState([]);
    const [form, setForm] = useState({ name: "", calories: "" });

    const userId = "user_id_from_login"; // Replace with actual user ID

    useEffect(() => {
        fetchFoods();
    }, []);

    const fetchFoods = async () => {
        const res = await getFood(userId);
        setFoods(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addFood({ ...form, userId });
        fetchFoods();
    };

    return (
        <div>
            <h2>Calorie Tracker</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Food Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input type="number" placeholder="Calories" onChange={(e) => setForm({ ...form, calories: e.target.value })} />
                <button type="submit">Add Food</button>
            </form>
            <ul>
                {foods.map((food) => (
                    <li key={food._id}>{food.name} - {food.calories} cal</li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
