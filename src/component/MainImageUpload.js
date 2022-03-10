import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import ImageUploading from "react-images-uploading";

const MainImageUpload = ({upload, profileImg}) => {

    return (
        <ImageUploading
            value={profileImg}
            onChange={upload}
            maxNumber={1}
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
                        variant="outlined"
                        style={isDragging ? { color: "red" } : null}
                        onClick={onImageUpload}
                        {...dragProps}
                        disabled={imageList[0]}
                    >
                        이미지 업로드
                    </Button>
                    &nbsp;
                    {imageList.map((image, index) => (
                        <div key={index} className="image-item">
                            <img src={image.data_url} alt="" width="250" />
                            <div className="image-item__btn-wrapper">
                                <Button onClick={() => onImageUpdate(index)} variant="outlined">이미지 교체</Button>
                                <Button onClick={() => onImageRemove(index)} variant="outlined">이미지 제거</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ImageUploading>
    )
}

export default MainImageUpload;