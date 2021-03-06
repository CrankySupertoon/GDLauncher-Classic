// @flow
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import styles from './NavigationBar.scss';
import HorizontalMenu from './components/HorizontalMenu/HorizontalMenu';
import logo from '../../../assets/images/logo.png';

export default props => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      ipcRenderer.send('check-for-updates');
      ipcRenderer.on('update-available', () => {
        setUpdateAvailable(true);
      });
    }
  }, []);

  return (
    <div className={styles.container}>
      <HorizontalMenu location={props.location} />
      <Link
        to={{
          pathname: '/settings/myAccount_Preferences',
          state: { modal: true }
        }}
      >
        <FontAwesomeIcon icon={faCog} className={styles.settings} />
      </Link>
	  <Link>
        <div onClick={() => props.logout()}>    
            <FontAwesomeIcon icon={faSignOutAlt} className={styles.logout} />    
        </div>
      </Link>    
      {updateAvailable && (
        <div className={styles.updateAvailable}>
          <Link to="/autoUpdate">
            <Button type="primary" size="small" style={{ marginLeft: 5 }}>
              Update Available
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
