import React, { useState } from 'react'
import { useAuth } from '../store/auth';
import { toast } from 'react-toastify';
import Img from "./Images";
import SpinLoader from './SpinLoader';

const CartItems = ({ item }) => {
    const { userData, getCartDetails } = useAuth();
    let ingredients = item['ingredients'];
    const entries = Object.entries(ingredients);

    const [loader, setLoader] = useState(false);

    const itemId = item['_id']

    const deleteChange = async () => {
        setLoader(true);
        try {
            const result = await fetch(`${import.meta.env.VITE_BASE_URL}/cart`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ _id: itemId, email: userData['email'] }),
            });
            const res = await result.json();
            setLoader(false);
            if (result.ok) {
                getCartDetails(userData);
                toast.success(res.msg);
            } else {
                toast.error(res.msg || "Internal Server Error");
            }
        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    }

    return (
        <div className="card my-4 fade-in-div" style={{ color: "white", backgroundColor: "purple" }}>
            <img loading='lazy' src={Img["Slide1"]} className="card-img-top" alt="Cart-Item" style={{ objectFit: "cover", height: "300px" }} />
            <div className="card-body">
                <h4 className="card-title">Custom Pizza</h4>
                <div className='d-flex justify-content-center mt-3'>
                    <table className='table'>
                        <thead className='table-dark'>
                            <tr>
                                <th scope="col">Ingredient Type</th>
                                <th scope="col">Ingredients</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((curr, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">{curr[0]}</th>
                                        <td>{curr[1].toString()}</td>
                                    </tr>
                                )
                            })}
                            <tr className='table-info'>
                                <th scope="row">Grand Total</th>
                                <td>{item["price"]} Rs.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <button className='btn btn-outline-dark' data-toggle="tooltip" title="Delete this Item" onClick={deleteChange}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                    </button>
                </div>
            </div>
            {loader ? <SpinLoader /> : <></>}
        </div>
    )
}

export default CartItems