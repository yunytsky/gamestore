import { addFundsSchema, loginSchema } from "../../schemas";
import {useFormik} from "formik";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api";
import { AuthContext } from "../../context/AuthContext";

const AddFundsForm = () => {
    const [submitError, setSubmitError] = useState({error: false, message: ""});
    const navigate = useNavigate();
    const {setUser} = useContext(AuthContext);

    const onSubmit = async (values, actions) => {
      try {        
        if(submitError){
          setSubmitError({error: false, message: ""});
        }

        const config = {withCredentials: true}
      
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);

        actions.resetForm();
        navigate("/store");

      } catch (error) {
        if(error.response && error.response.data.message){
          setSubmitError({error: true, message: error.response.data.message})
        }else{
          
          setSubmitError({error: true, message: "Error"})
        }
      }
    }

    const formik = useFormik({
        initialValues: {
            amount: "",
            cardNumber: "",
            expiryDate: "",
            cvv: ""
        },
        validationSchema: addFundsSchema,
        onSubmit: onSubmit,
    });

    return (
      <form onSubmit={formik.handleSubmit} className="add-funds-form">
        {/* Amount */}
        <label className="form-label" htmlFor="email">
          Amount
        </label>
        <input
          placeholder="$100"
          type="number"
          className="form-input"
          name="amount"
          id="amount"
          value={formik.values.amount}
          onChange={formik.handleChange}
        />

        {formik.errors.amount && formik.touched.amount && (
          <span className="form-error">{formik.errors.amount}</span>
        )}

        {/* Card number */}
        <label className="form-label" htmlFor="cardNumber">
          Card number
        </label>
        <input
          placeholder="0000 0000 0000 0000"
          type="text"
          className="form-input"
          name="cardNumber"
          id="cardNumber"
          value={formik.values.cardNumber}
          onChange={formik.handleChange}
        />

        {formik.errors.cardNumber && formik.touched.cardNumber && (
          <span className="form-error">{formik.errors.cardNumber}</span>
        )}

        <div className="vertical-inputs">
            {/* Expiry date */}
            <div className="expiry-date">
                <label className="form-label" htmlFor="expiryDate">
                  Expiry date
                </label>
                <input
                  type="text"
                  className="form-input"
                  name="expiryDate"
                  id="expiryDate"
                  value={formik.values.expiryDate}
                  onChange={formik.handleChange}
                />
            </div>
            {formik.errors.expiryDate && formik.touched.expiryDate && (
              <span className="form-error">{formik.errors.expiryDate}</span>
            )}
            
            {/* CVV */}
            <div className="cvv">
                <label className="form-label" htmlFor="cvv">
                  CVV
                </label>
                <input
                  type="number"
                  className="form-input"
                  name="cvv"
                  id="cvv"
                  value={formik.values.cvv}
                  onChange={formik.handleChange}
                />
            </div>
            {formik.errors.cvv && formik.touched.cvv && (
              <span className="form-error">{formik.errors.cvv}</span>
            )}
        </div>




     
        {/* Submit button */}
        <button type="submit" className="button">
          Pay
        </button>

        {/* Submit error */}
        {submitError.error && (
          <span className="form-submit-error">{submitError.message}</span>
        )}

      </form>
    );
};

export default AddFundsForm;