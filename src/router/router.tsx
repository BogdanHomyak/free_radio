import {createBrowserRouter, RouteObject} from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";
import FormComponent from "../components/FormComponent/FormComponent";
import LettersPage from "../pages/LettersPage/LettersPage";
import ErrorLayout from "../layouts/ErrorLayout/ErrorLayout";
import HomePage from "../pages/HomePage/HomePage";

const routes:RouteObject[] = [
    {
        path: '', element: <MainLayout/>,
        errorElement: <ErrorLayout/>,
        children: [
            {index:true, element:<HomePage/>},
            {path:'/letters', element:<LettersPage/>},
            {path:'/form', element:<FormComponent/>}
        ]
    },
]
const router = createBrowserRouter(routes);

export {
    router
}