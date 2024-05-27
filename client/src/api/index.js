import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
});

const INTERCEPTOR_401_EXCLUDED = ['/log-in'];

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401 && !INTERCEPTOR_401_EXCLUDED.some(route => error.config.url.includes(route))) {
      try {
        const res = await instance.post(`/auth/log-out`, {}, {withCredentials: true});
        localStorage.removeItem("user");
        window.location.href = "/login";

      } catch (error) {
        
      }
  
      throw error;
    }else{
      throw error;
    }
  }
);

//-------------------
//Auth
export const checkIfEmailTaken = (email, config) => {
  return instance.get(`/auth/email-taken?email=${email}`,config);
};

export const login = (data, config) => {
  return instance.post(`/auth/log-in`, data, config);
};

export const signup = (data, config) => {
  return instance.post(`/auth/sign-up`, data, config);
};

export const logout = (config) => {
  return instance.post(`/auth/log-out`, {}, config);
};

export const changeUserPassword = (data, config) => {
  return instance.patch(`/auth/change-password`, data, config);
}

export const changeUserEmail = (data, config) => {
  return instance.patch(`/auth/change-email`, data, config);
}

export const verifyAccount = (data, config) => {
  return instance.patch(`/auth/verify`, data, config);
};

export const sendVerificationCode = (data, config) => {
  return instance.post(`/auth/send-verification-code`, data, config);
}

export const confirmPasswordReset = (data, config) => {
  return instance.patch(`/auth/confirm-password-reset`, data, config);
}

export const resetPassword = (data, config) => {
  return instance.patch(`/auth/reset-password`, data, config);
}

export const deleteAccount = (data, config) => {
  return instance.delete(`/auth/account`, {...config, data});
}

export const updateUserCountry = (data, config, userId) => {
  return instance.patch(`/users/${userId}/update-country`, data, config);
}
//-------------------
//

export const getGames = (config) => {
  return instance.get(`/games`, config);
};

export const getGame = (config, gameId) => {
  return instance.get(`/games/game/${gameId}`, config);
};

export const getUserGames = (config) => {
  return instance.get(`/users/:userId/games`, config);
};

export const getUserCart = (config, userId) => {
  return instance.get(`/users/${userId}/cart`, config);
};

export const addToCart = (config, data, userId) => {
  return instance.post(`/users/${userId}/cart/add`, data, config);
};

export const removeFromCart = (config, data, userId) => {
  return instance.delete(`/users/${userId}/cart/remove`, {...config, data});
};

export const buyGames = (config, data, userId) => {
  return instance.post(`/users/${userId}/cart/buy`, data, config);
};

export const addFunds = (config, data, userId) => {
  return instance.patch(`/users/${userId}/balance/add`, data, config);
};
