import { Button, Popover } from "@mui/material";
import React from "react";

const PopUpPage = ({anchorEl, setAnchorEl}) => {

    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
            >
                {/* <Typography sx={{ p: 2 }}>이메일 인증이 필요합니다.</Typography> */}
                <Button
                    variant="outlined" 
                    color="error"
                    sx={{ p: 2 }}
                >
                    이메일 인증이 필요합니다.
                    </Button>
            </Popover>
        </div>
    )
}

export default PopUpPage;