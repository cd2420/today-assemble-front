import React  from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Button, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box } from '@mui/system';

function FeaturedPost(props) {
  const navigate = useNavigate();
  const { post } = props;
  post.tagsDtos = post.tagsDtos.splice(0,4);

  return (
    <Grid item xs={12} md={4}>     
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea component="a" href="" onClick={() => navigate(`/events/${post.id}`)}>
          <CardMedia
            component="img"
            sx={{ height: 250,mdisplay: { xs: 'none', sm: 'block' } }}
            image={post.mainImage}
          />
          <CardContent>
            <Typography component="h2" variant="h5">
              {post.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              시작 날짜: {post.date}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              걸리는 시간: {post.takeTime}시간
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
                참여인원 : {post.nowMembers} / {post.maxMembers}
            </Typography>
            <div>
                {post.tagsDtos.map((tag, idx) => (
                    <Button 
                      variant="outlined" 
                      key={idx}
                      sx={{ m: 0.5 }}
                      style={{
                          borderRadius: 20
                      }}
                    >
                      #{tag.name}
                    </Button>
                ))}
            </div>
          </CardContent>
        </CardActionArea>
        <CardActions>
            <Button variant="outlined" style={{cursor: 'default'}}>
              좋아요 <FavoriteIcon /> : {post.likesAccountsDtos ? post.likesAccountsDtos.length : 0 }
            </Button>
        </CardActions>  
      </Card>
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