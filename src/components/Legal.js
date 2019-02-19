import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import HeaderHome from './HeaderHome';
import Footer from './Footer';
import { Typography } from '@material-ui/core';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    padding: `${theme.spacing.unit * 2}px`,
  },
  members: {
    padding: `${theme.spacing.unit * 3}px`,
  },
  title: {
    textAlign: 'center',
  },
  divSize: {
    maxWidth: 850,
    margin: 'auto',
  },
});

class Legal extends Component {
  render() {
    const { classes, handleOpen, handleClose, open } = this.props;
    return (
      <div>
        <Grid container className={classes.root} direction="row" justify="space-between">
          <Grid item xs={12}>
            <HeaderHome
              handleOpen={handleOpen}
              handleClose={handleClose}
              open={open}
              goBack={true}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.title} variant="h3" component="h2">
              Gext Legal - Terminos & Condiciones
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.divSize}>
              <p>
                Gext es un proyecto Opensouce de Adalab y Triporate cuyo código fuente se encuentra
                en:
                <a href="https://github.com/search?q=easley-s4-gext">
                  https://github.com/search?q=easley-s4-gext
                </a>
              </p>
              <p>
                Gext es un proyecto Opensouce de Adalab y Triporate cuyo código fuente se encuentra
                No utilizamos cookies propias, ni guardamos datos personales ni de ningún tipo. Nos
                conectamos a Google Drive API y Slides API para poder generar plantillas de un modo
                dinámico. Todo el código se ejecuta en la máquina Javascript y navegador de los
                usuarios, sin que se mande nada a ningún servidor que no sea de Google. Para
                cualquier duda legal, se puede contactar con nosotras en legal@gext.es.
              </p>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Footer />
          </Grid>
        </Grid>
      </div>
    );
  }
}

Legal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Legal);
