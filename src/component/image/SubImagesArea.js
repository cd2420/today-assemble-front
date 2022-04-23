import { Button, CardActionArea, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import SubImageUpload from './SubImageUpload';
import _ from 'lodash';

const SubImagesArea = ({event, isHost, upload, removeEventsSubImg}) => {

    const [imgOpenCheck, setImgOpenCheck] = useState([]);

    useEffect(() => {
        const check = [];
        for (let i = 0; i < event.subImage.length; i++) {
            check.push(false);
        }
        setImgOpenCheck(check);

    }, [event])

    const subImgDetailOpen = (e) => {
        const {target: {value}} = e;
        const tmp_subImg = _.cloneDeep(imgOpenCheck);
        tmp_subImg[value] = true;
        setImgOpenCheck(tmp_subImg);
    }

    const subImgDetailClose = (e) => {
        const {target: {value}} = e;
        const tmp_subImg = _.cloneDeep(imgOpenCheck);
        tmp_subImg[value] = false;
        setImgOpenCheck(tmp_subImg);
    }

    return (
        <Box
            mb={2}
            display="flex"
            flexDirection="row"
            style={{
                maxHeight: '100vh', // fixed the height
                overflow: "scroll",
                overflowY: "hidden" // added scroll
            }}
        >
            
            {event.subImage.map((subImage, idx) => (
                <Grid 
                    container 
                    key = {idx + 'box'}
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{width: 200, height: 200, m:1}}
                >
                    <Grid 
                        item
                    >
                        <CardActionArea 
                            component="a" 
                            // href="" 
                            value={idx}
                            onClick={() => subImgDetailOpen({target: {value: idx}})}
                        >
                            <CardMedia
                                key = {idx + 'idx'}
                                component="img"
                                image={subImage.image}
                                style={{
                                    borderRadius: 2
                                }}
                            />
                        </CardActionArea>
                        {
                            imgOpenCheck[idx]
                            &&
                            <Dialog onClose={() => subImgDetailClose({target: {value: idx}})} open={imgOpenCheck[idx]}>
                                <DialogTitle onClose={() => subImgDetailClose({target: {value: idx}})}>
                                    상세 이미지
                                </DialogTitle>
                                <DialogContent>
                                    <CardMedia
                                        component="img"
                                        image={subImage.image}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    {
                                        isHost &&
                                        <Button variant="contained" color="error" onClick={() => removeEventsSubImg({target: {value: idx}})}>삭제</Button>
                                    }
                                    <Button variant="contained" color="primary" onClick={() => subImgDetailClose({target: {value: idx}})}>닫기</Button>
                                </DialogActions>
                            </Dialog>
                        }
                        
                    </Grid>
                </Grid>
                ))
            }
            {
                isHost && 
                (
                    <SubImageUpload upload={upload} profileImg={[]} />
                )
            }
            
        </Box>
    )

}

export default SubImagesArea;