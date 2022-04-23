import { Grid, Pagination } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import FeaturedPost from '../FeaturedPost';

const Items = ({ currentItems }) => {
  return (
    <Grid container spacing={4}>
        {currentItems.map(item => (
            <FeaturedPost key={item.id} post={item} />
        ))}
    </Grid>
  );
}

const PaginatedItems = ({ handlePageClick, currentItems, pageCount }) => {

  return (
    <>
      <Items currentItems={currentItems} />
      <Box
        sx={{
          '& > *': {
            m: 3,
          }
      }}
      >
        <Pagination count={pageCount} onChange={handlePageClick} color="primary" size="large"/>
      </Box>
    </>
  );
}

export default PaginatedItems;