import { Button } from "@mui/material";
import React from "react";
import ImageUploading from "react-images-uploading";

const SubImageUpload = ({upload, profileImg}) => {

    return (
        <ImageUploading
            multiple
            value={profileImg}
            onChange={upload}
            maxNumber={20}
            dataURLKey="data_url"
        >
            {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps
                }) => (
                // write your building UI
                <div className="upload__image-wrapper">
                    <Button
                        sx={{ width: 160, m:1, border: '1px dashed grey' }}
                        variant="outlined"
                        style={isDragging ? { color: "red" } : null}
                        onClick={onImageUpload}
                        {...dragProps}
                    >
                        사진 추가
                    </Button>
                </div>
            )}
        </ImageUploading>
    )
}

export default SubImageUpload;