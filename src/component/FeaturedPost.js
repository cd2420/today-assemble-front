import React  from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function FeaturedPost(props) {
  const navigate = useNavigate();
  const { post } = props;
  post.tagsDtos = post.tagsDtos.splice(0,4);

  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component="a" href="" onClick={() => navigate(`/events/${post.id}`)}>
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
            {/* 총 인원, 좋아요 */}
          </CardContent>
          <CardMedia
            component="img"
            sx={{ width: 160, height: 250, mdisplay: { xs: 'none', sm: 'block' } }}
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