import { addFundsSchema, loginSchema } from "../../schemas";
import {useFormik} from "formik";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addFunds, login } from "../../api";
import { AuthContext } from "../../context/AuthContext";

const AddFundsForm = () => {
    const [submitError, setSubmitError] = useState({error: false, message: ""});
    const navigate = useNavigate();
    const {user, setUser} = useContext(AuthContext);

    const onSubmit = async (values, actions) => {
      try {        
        if(submitError){
          setSubmitError({error: false, message: ""});
        }

        values = {
          ...values,
          cardNumber: values.cardNumber.replace(/\s+/g, ''),
        };

        const config = {withCredentials: true}
        
        console.log(values)
        const res = await addFunds(config, values, user.userId)
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);  

        actions.resetForm();
        navigate("/successfull-funding", {state: {navigated: true}});

      } catch (error) {
        console.log(error)
        if(error.response && error.response.data.message){
          setSubmitError({error: true, message: error.response.data.message})
        }else{
          setSubmitError({error: true, message: "Error"})
        }
      }
    }

    const handleCardNumberChange = (e) => {
      let { value } = e.target;
  
      // Remove all non-digit characters
      value = value.replace(/\D/g, '');
  
      // Limit the input to 16 digits
      if (value.length > 16) {
        value = value.substring(0, 16);
      }
  
      // Add spaces every 4 characters
      value = value.replace(/(.{4})/g, '$1 ').trim();
      console.log(value)
      formik.setFieldValue('cardNumber', value);
    };

    const handleExpiryDateChange = (e) => {
      let { value } = e.target;
  
      // Remove all non-digit and non-slash characters
      value = value.replace(/[^\d\/]/g, '');
  
      // Limit the input to 4 digits plus one slash (5 characters)
      if (value.length > 5) {
        value = value.substring(0, 5);
      }
  
      // Add slash after 2 digits
      if (value.length == 2 && !value.includes('/')) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
  
      formik.setFieldValue('expiryDate', value);
    };

    const handleCvvChange = (e) => {
      let { value } = e.target;
  
      // Remove all non-digit characters
      value = value.replace(/\D/g, '');
  
      // Limit the input to 3 digits
      if (value.length > 3) {
        value = value.substring(0, 3);
      }
  
      formik.setFieldValue('cvv', value);
    };

    
  

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
          Amount (USD)
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
          onChange={(e) => {formik.handleChange(e); handleCardNumberChange(e)}}
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
                  placeholder="MM/YY"
                  type="text"
                  className="form-input"
                  name="expiryDate"
                  id="expiryDate"
                  value={formik.values.expiryDate}
                  onChange={(e) => {formik.handleChange(e); handleExpiryDateChange(e)}}
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
                 placeholder="000"
                  type="number"
                  className="form-input"
                  name="cvv"
                  id="cvv"
                  value={formik.values.cvv}
                  onChange={(e) => {formik.handleChange(e); handleCvvChange(e)}}

                />
            </div>
            {formik.errors.cvv && formik.touched.cvv && (
              <span className="form-error">{formik.errors.cvv}</span>
            )}
        </div>




     
        {/* Submit button */}
        <button type="submit" className="button" >
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