# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
    extends: [
        // Remove ...tseslint.configs.recommended and replace with this
        ...tseslint.configs.recommendedTypeChecked,
        // Alternatively, use this for stricter rules
        ...tseslint.configs.strictTypeChecked,
        // Optionally, add this for stylistic rules
        ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
        // other options...
        parserOptions: {
            project: ['./tsconfig.node.json', './tsconfig.app.json'],
            tsconfigRootDir: import.meta.dirname,
        },
    },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
    plugins: {
        // Add the react-x and react-dom plugins
        'react-x': reactX,
        'react-dom': reactDom,
    },
    rules: {
        // other rules...
        // Enable its recommended typescript rules
        ...reactX.configs['recommended-typescript'].rules,
        ...reactDom.configs.recommended.rules,
    },
});
```

.GET all foods from database :
URL :https://foodordersystem.glitch.me/api/foods
REQUEST:GET
PARAMS :None

2.Geeting Particular Food item :
URL : https://foodordersystem.glitch.me/api/food/id
REQUEST:GET
PARAMS:None

3.Adding new Food item :
URL : https://foodordersystem.glitch.me/api/food
REQUEST:POST
PARAMS: food_name , food_desc , food_price ,food_image

4.Update particular food item depends on id:
URL: https://foodordersystem.glitch.me/api/food/id
REQUEST:PUT/PATCH
PARAMS: food_name , food_desc , food_price , food_image

5.Delete particular food item depends on Id :
URL: https://foodordersystem.glitch.me/api/food/id
REQUEST:DELETE
PARAMS: None

6.GET all foods with price limit :
URL :https://foodordersystem.glitch.me/api/foods/lim1/lim2
REQEST:GET
PARAMS :lim1,lim2

## Bong Thali -2025 SignUp/Signin Api End Points :

1.SignUP :
URL :https://foodordersystem.glitch.me/api/user/signup
REQEST:POST
PARAMS :name,phone,email,pass1

2.SignIn:
URL :https://foodordersystem.glitch.me/api/user/signin
REQEST:POST
PARAMS :email,pass1
