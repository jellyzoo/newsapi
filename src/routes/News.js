import { useState, useCallback } from "react";

import NewsList from "../components/NewsList";
import Categories from "../components/Categories";

const News = () => {
    const [category, setCategory] = useState('flowers');
    const onSelect = useCallback(category => setCategory(category),[]);
    return(
        <>
            <Categories category={category} onSelect={onSelect} />
            <NewsList category={category} />
        </>
    );
};

export default News;