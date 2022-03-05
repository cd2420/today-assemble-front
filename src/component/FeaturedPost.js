import React, {useEffect, useState}  from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Button } from '@mui/material';

function FeaturedPost(props) {
  const { post } = props;

  useEffect(() => {
    console.log(props)
  }, [])

  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component="a" href="#">
        <Card sx={{ display: 'flex' }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              {post.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              시작 날짜: {post.date}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              걸리는 시간: {post.takeTime}시간
            </Typography>
            <Typography variant="subtitle1" paragraph>
              {post.description}
            </Typography>
            <div>
                {post.tagsDtos.map(tag => (
                    <Button variant="contained">{tag.name}</Button>
                ))}
            </div>
          </CardContent>
          <CardMedia
            component="img"
            sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
            image={post.mainImage}
          />
        </Card>
      </CardActionArea>
    </Grid>
  );
}

FeaturedPost.propTypes = {
  post: PropTypes.shape({
    eventsTime: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default FeaturedPost;