import React from 'react';
import global from '../../styles/Global.module.css';

const PageTitle = React.memo(({ title, complementImage = "/images/complemento-1.png" }) => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-auto">
          <div className="d-flex align-items-center">
            <img
              src={complementImage}
              alt="Complemento"
              className={global.complementoImg + " me-2"}
            />
            <h1 className={`${global.title} mb-0`}>{title}</h1>
          </div>
        </div>
      </div>
    </div>
  );
});

PageTitle.displayName = 'PageTitle';

export default PageTitle;