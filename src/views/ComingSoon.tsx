import Title from '../components/Title';
import InfoBox from '../components/InfoBox';
import Filters from '../layouts/Filters';


const ComingSoonView: React.FC<{ title: string, subtitle: string }> = ({ title, subtitle }) => {
  return (
    <>
      <Filters>
        <div className="row bottom-xs w-100">
          <div className="col-xs-12 col-lg-6">
            <Title
              primaryColor="grey-1"
              title={<span>{title}</span>}
              subtitle={subtitle}
            />
            <InfoBox
              color="grey-1"
              text="This page is under development."
            />
          </div>
        </div>
      </Filters>
    </>
  );
};

export default ComingSoonView;
