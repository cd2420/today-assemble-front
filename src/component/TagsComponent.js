import React, { useCallback } from "react";
import Tags from "@yaireo/tagify/dist/react.tagify";
import "@yaireo/tagify/dist/tagify.css";

const TagsComponent = ({setTags, defaultValue}) => {

    const onChange = useCallback((e) => {
        // console.log("CHANGED:"
        //   , e.detail.tagify.value // Array where each tag includes tagify's (needed) extra properties
        //   , e.detail.tagify.getCleanValue() // Same as above, without the extra properties
        //   , e.detail.value // a string representing the tags
        // )

        const tmp_tags = [];
        e.detail.tagify.getCleanValue().forEach(element => {
            const {value} = element;
            tmp_tags.push(value);
        });
        setTags(tmp_tags);

      }, []);

    return (
        <Tags 
            onChange={onChange}
            placeholder="태그 입력"
            defaultValue={defaultValue}
        />
    )
}

export default TagsComponent;