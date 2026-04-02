import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from '../../atom/heading';
import ListContainer, {
  ListContainerSeparate,
} from '../../organism/ListContainer';
import { MetricCardLong } from '../listContainerContent';
import { formatMetricValue, expandStateAbbreviation } from '../../../../lib/stringFormatters';
import { getCmprColor } from '../../../../lib/getBadgeColor';
/**
 *  This component displays the Clinical Quality Measures data for an individual facility. Will be apart of the dynamic tabs scheme.
 */

export default function ClinicalQualityTab({ facility, status, national }) {
  const data = facility;
  console.log(data);
  console.log('national:', national);

  const longStayStats = [
    {
      id: 1,
      title: 'Increased need for help with daily activities',
      subtitle: 'Lower percentages are better',
      value: formatMetricValue(data?.ls_adl_help_increased),
      label: data?.cmpr_ls_adl_help_increased,
      labelColor: getCmprColor(data?.cmpr_ls_adl_help_increased),
      state: expandStateAbbreviation(data?.state),
      stateAvg: formatMetricValue(data?.state_ls_adl_help_increased),
      nationalAverage: formatMetricValue(
        national?.national_ls_adl_help_increased,
      ),
    },
    {
      id: 2,
      title: 'Received antianxiety or hypnotic medication',
      subtitle: 'Lower percentages are better',
      value: formatMetricValue(data?.ls_antianxiety_medication),
      label: data?.cmpr_ls_antianxiety_medication,
      labelColor: getCmprColor(data?.cmpr_ls_antianxiety_medication),
      state: expandStateAbbreviation(data?.state),
      stateAvg: formatMetricValue(data?.state_ls_antianxiety_medication),
      nationalAverage: formatMetricValue(
        national?.national_ls_antianxiety_medication,
      ),
    },
    {
      id: 3,
      title: 'Antipsychotic medication',
      subtitle: 'Lower percentages are better',
      value: formatMetricValue(data?.ls_antipsychotic_medication),
      label: data?.cmpr_ls_antipsychotic_medication,
      labelColor: getCmprColor(data?.cmpr_ls_antipsychotic_medication),
      state: expandStateAbbreviation(data?.state),
      stateAvg: formatMetricValue(data?.state_ls_antipsychotic_medication),
      nationalAverage: formatMetricValue(
        national?.national_ls_antipsychotic_medication,
      ),
    },
    {
      id: 4,
      title: 'Indwelling Catheter',
      subtitle: 'Lower percentages are better',
      value: formatMetricValue(data?.ls_catheter),
      label: data?.cmpr_ls_catheter,
      labelColor: getCmprColor(data?.cmpr_ls_catheter),
      state: expandStateAbbreviation(data?.state),
      stateAvg: formatMetricValue(data?.state_ls_catheter),
      nationalAverage: formatMetricValue(national?.national_ls_catheter),
    },
    {
      id: 5,
      title: 'Depressive symptoms',
      subtitle: 'Lower percentages are better',
      value: formatMetricValue(data?.ls_depressive_symptoms),
      label: data?.cmpr_ls_depressive_symptoms,
      labelColor: getCmprColor(data?.cmpr_ls_depressive_symptoms),
      state: expandStateAbbreviation(data?.state),
      stateAvg: formatMetricValue(data?.state_ls_depressive_symptoms),
      nationalAverage: formatMetricValue(
        national?.national_ls_depressive_symptoms,
      ),
    },
    {
      id: 6,
      title: 'Falls with major injury',
      subtitle: 'Lower percentages are better',
      value: formatMetricValue(data?.ls_falls_major_injury),
      label: data?.cmpr_ls_falls_major_injury,
      labelColor: getCmprColor(data?.cmpr_ls_falls_major_injury),
      state: expandStateAbbreviation(data?.state),
      stateAvg: formatMetricValue(data?.state_ls_falls_major_injury),
      nationalAverage: formatMetricValue(
        national?.national_ls_falls_major_injury,
      ),
    },
    {
      id: 7,
      title: 'New or worsened incontinence',
      subtitle: 'Lower percentages are better',
      value: formatMetricValue(data?.ls_incontinence),
      label: data?.cmpr_ls_incontinence,
      labelColor: getCmprColor(data?.cmpr_ls_incontinence),
      state: expandStateAbbreviation(data?.state),
      stateAvg: formatMetricValue(data?.state_ls_incontinence),
      nationalAverage: formatMetricValue(national?.national_ls_incontinence),
    },
    {
      id: 8,
      title: 'Physically restrained',
      subtitle: 'Lower percentages are better',
      value: formatMetricValue(data?.ls_physically_restrained),
      label: data?.cmpr_ls_physically_restrained,
      labelColor: getCmprColor(data?.cmpr_ls_physically_restrained),
      state: expandStateAbbreviation(data?.state),
      stateAvg: formatMetricValue(data?.state_ls_physically_restrained),
      nationalAverage: formatMetricValue(
        national?.national_ls_physically_restrained,
      ),
    },
    {
      id: 9,
      title: 'Received pneumococcal vaccine',
      subtitle: 'Higher percentages are better',
      value: formatMetricValue(data?.ls_pneumococcal_vaccine),
      label: data?.cmpr_ls_pneumococcal_vaccine,
      labelColor: getCmprColor(data?.cmpr_ls_pneumococcal_vaccine),
      state: expandStateAbbreviation(data?.state),
      stateAvg: formatMetricValue(data?.state_ls_pneumococcal_vaccine),
      nationalAverage: formatMetricValue(
        national?.national_ls_pneumococcal_vaccine,
      ),
    },
    {
      id: 10,
      title: 'Pressure ulcers',
      subtitle: 'Lower percentages are better',
      value: formatMetricValue(data?.ls_pressure_ulcers),
      label: data?.cmpr_ls_pressure_ulcers,
      labelColor: getCmprColor(data?.cmpr_ls_pressure_ulcers),
      state: expandStateAbbreviation(data?.state),
      stateAvg: formatMetricValue(data?.state_ls_pressure_ulcers),
      nationalAverage: formatMetricValue(national?.national_ls_pressure_ulcers),
    },
    {
      id: 11,
      title: 'Urinary tract infection',
      subtitle: 'Lower percentages are better',
      value: formatMetricValue(data?.ls_uti),
      label: data?.cmpr_ls_uti,
      labelColor: getCmprColor(data?.cmpr_ls_uti),
      state: expandStateAbbreviation(data?.state),
      stateAvg: formatMetricValue(data?.state_ls_uti),
      nationalAverage: formatMetricValue(national?.national_ls_uti),
    },
    {
      id: 12,
      title: 'Walking ability worsened',
      subtitle: 'Lower percentages are better',
      value: formatMetricValue(data?.ls_walk_worsened),
      label: data?.cmpr_ls_walk_worsened,
      labelColor: getCmprColor(data?.cmpr_ls_walk_worsened),
      state: expandStateAbbreviation(data?.state),
      stateAvg: formatMetricValue(data?.state_ls_walk_worsened),
      nationalAverage: formatMetricValue(national?.national_ls_walk_worsened),
    },
    {
      id: 13,
      title: 'Significant weight loss',
      subtitle: 'Lower percentages are better',
      value: formatMetricValue(data?.ls_weight_loss),
      label: data?.cmpr_ls_weight_loss,
      labelColor: getCmprColor(data?.cmpr_ls_weight_loss),
      state: expandStateAbbreviation(data?.state),
      stateAvg: formatMetricValue(data?.state_ls_weight_loss),
      nationalAverage: formatMetricValue(national?.national_ls_weight_loss),
    },
    {
      id: 14,
      title: 'Outpatient ED visits per 1,000 residents days',
      subtitle: 'Lower rates are better',
      value: formatMetricValue(data?.num_ed_visits_per_1000),
      label: data?.cmpr_num_ed_visits_per_1000,
      labelColor: getCmprColor(data?.cmpr_num_ed_visits_per_1000),
      state: expandStateAbbreviation(data?.state),
      stateAvg: formatMetricValue(data?.state_num_ed_visits_per_1000),
      nationalAverage: formatMetricValue(
        national?.national_num_ed_visits_per_1000,
      ),
    },
    {
      id: 15,
      title: 'Hospitalizations per 1,000 residents days',
      subtitle: 'Lower rates are better',
      value: formatMetricValue(data?.num_hospitalizations_per_1000),
      label: data?.cmpr_num_hospitalizations_per_1000,
      labelColor: getCmprColor(data?.cmpr_num_hospitalizations_per_1000),
      state: expandStateAbbreviation(data?.state),
      stateAvg: formatMetricValue(data?.state_num_hospitalizations_per_1000),
      nationalAverage: formatMetricValue(
        national?.national_num_hospitalizations_per_1000,
      ),
    },
  ];
  const shortStayStats = [
    {
      id: 1,
      title: 'Newly received antipsychotic medication',
      subtitle: 'Lower percentages are better',
      value: formatMetricValue(data?.ss_antipsychotic_medication),
      label: data?.cmpr_ss_antipsychotic_medication,
      labelColor: getCmprColor(data?.cmpr_ss_antipsychotic_medication),
      state: expandStateAbbreviation(data?.state),
      stateAvg: formatMetricValue(data?.state_ss_antipsychotic_medication),
      nationalAverage: formatMetricValue(
        national?.national_ss_antipsychotic_medication,
      ),
    },
    {
      id: 2,
      title: 'Outpatient ED visits',
      subtitle: 'Lower percentages are better',
      value: formatMetricValue(data?.ss_ed_visit),
      label: data?.cmpr_ss_ed_visit,
      labelColor: getCmprColor(data?.cmpr_ss_ed_visit),
      state: expandStateAbbreviation(data?.state),
      stateAvg: formatMetricValue(data?.state_ss_ed_visit),
      nationalAverage: formatMetricValue(national?.national_ss_ed_visit),
    },
    {
      id: 3,
      title: 'Rehospitalized after admission',
      subtitle: 'Lower percentages are better',
      value: formatMetricValue(data?.ss_rehospitalized),
      label: data?.cmpr_ss_rehospitalized,
      labelColor: getCmprColor(data?.cmpr_ss_rehospitalized),
      state: expandStateAbbreviation(data?.state),
      stateAvg: formatMetricValue(data?.state_ss_rehospitalized),
      nationalAverage: formatMetricValue(national?.national_ss_rehospitalized),
    },
    {
      id: 4,
      title: 'Received pneumococcal vaccine',
      subtitle: 'Higher percentages are better',
      value: formatMetricValue(data?.ss_pneumococcal_vaccine),
      label: data?.cmpr_ss_pneumococcal_vaccine,
      labelColor: getCmprColor(data?.cmpr_ss_pneumococcal_vaccine),
      state: expandStateAbbreviation(data?.state),
      stateAvg: formatMetricValue(data?.state_ss_pneumococcal_vaccine),
      nationalAverage: formatMetricValue(
        national?.national_ss_pneumococcal_vaccine,
      ),
    },
  ];

  return (
    <section>
      {status === 'owner' && (
        <div className="pt-8">
          <p className="text-paragraph-lg">
            Scores represent the{' '}
            <span className="font-bold">weighted average </span>
            across all facilities under this owner&apos;s management.
          </p>
        </div>
      )}

      {/**Long Stay Stats */}
      <div>
        <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
          Long Stay
        </Heading>
        <ListContainer
          items={longStayStats}
          LayoutSelector={ListContainerSeparate}
          ListContent={MetricCardLong}
        />
      </div>
      {/**Long Stay Stats */}
      <div className="pb-8">
        <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
          Short Stay
        </Heading>
        <ListContainer
          items={shortStayStats}
          LayoutSelector={ListContainerSeparate}
          ListContent={MetricCardLong}
        />
      </div>
    </section>
  );
}

ClinicalQualityTab.propTypes = {
  facility: PropTypes.object,
  status: PropTypes.string,
  national: PropTypes.object,
};
