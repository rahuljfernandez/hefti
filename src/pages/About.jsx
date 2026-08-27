import React from 'react';
import PropTypes from 'prop-types';
import LayoutPage from '../components/ui/atom/layout-page';
import { Heading } from '../components/ui/atom/heading';

const people = [
  {
    name: 'Dr Robert Tyler Braun',
    role: 'Founder and Director',
    photo: '/bios/dr-braun.jpg',
    bio: 'Dr. Braun is the founder and director of the Health Economics, Financing, and Transparency Initiative. Dr. Braun is an Assistant Professor in the Division of Health Policy and Economics at Weill Cornell Medical College.\n\nHis current research is focused on the organization of the health care system with a particular interest in the evolution of changes in the organization and financing of physician practices and providers of end-of-life and long-term care. As principal investigator on several grants, from funders such as the National Institute on Aging and Arnold Ventures, his team is in the process of examining physician and long-term care organization, financing, and behavior within the U.S. health delivery system. Currently, his research interests are related to regulation, enforcement, and mergers and acquisitions of physician practices, hospices, and nursing homes.\n\nHis research is published in prominent journals such as the New England Journal of Medicine, JAMA Internal Medicine, and Health Affairs. His research has received coverage from major media outlets, including The New York Times, Washington Post, and The New Yorker Magazine. Furthermore, his research has received substantial attention from policymakers, including The White House, Congressional Budget Office, Senate Finance Committee, and the House Ways and Means Committee.',
  },
  {
    name: 'Dr Dunc Williams, Jr',
    role: 'Co-Director',
    photo: '/bios/dr-williams.jpg',
    bio: 'John Duncan “Dunc” Williams, Jr. is a tenured Associate Professor of healthcare financial management at the Medical University of South Carolina in the Department of Health Care Leadership and Management in Charleston, South Carolina.\n\nDunc enjoys teaching healthcare finance and accounting courses to students in the master and doctoral programs of health administration where he embeds policy-relevant healthcare financial decision-making and passion for improving healthcare into the classroom. His research focuses on various financial and operational aspects of healthcare management and policy, with recent work investigating consolidation, telehealth, and investments in multiple healthcare industries (e.g., hospitals, nursing homes, hospice, home health, and physician practices).\n\nDunc holds a PhD in healthcare financial management from the University of North Carolina Chapel Hill Gillings School of Global Public Health Department of Health Policy and Management. He earned a Master in Health Administration from the Medical University of South Carolina, a Master of Theological Studies from Duke Divinity School, and a Bachelor of Science in Accounting from the University of South Carolina.\n\nHe has prior work experience in accounting, physician practices operations, and hospital service-line administration. Outside of work, Dunc enjoys spending time with his wife and kids.',
  },
  {
    name: 'Dr David Stevenson',
    role: 'Co-Director',
    photo: '/bios/dr-stevenson.jpg',
    bio: 'David Stevenson, PhD, SM, is the Mike Curb Chair and Professor of Health Policy at Vanderbilt University School of Medicine.\n\nDr. Stevenson’s primary research interests are aging, end-of-life care and long-term care, with a particular focus on quality and safety of care. His previous work has focused on a range of topics in these areas, including the evolution of Medicare’s hospice benefit, the role of ownership in the provision of hospice care and nursing home care, and regulatory oversight of hospice agencies and nursing homes.\n\nDr. Stevenson has served on several expert panels and national committees related to his work, including Technical Expert Panels for the 5-Star Quality Rating System and the Hospice Quality Reporting Program, the External Monitoring Committee for the NIA State Alzheimer’s Research Support Center (StARS), the Moving Forward Nursing Home Quality Coalition, and the National Academies of Sciences, Engineering, and Medicine Committee on the Quality of Care in Nursing Homes. He has also served on editorial boards for Health Services Research, Journal of Pain and Symptom Management, and the Journal of the American Medical Director’s Association.\n\nThroughout his career, Dr. Stevenson has maintained a strong focus on educational activities, including mentorship and teaching to graduate and medical students, residents, and fellows. He has served in numerous educational leadership roles at Vanderbilt, including faculty Co-Chair of the MD Admissions Committee and Health Policy Track Director in the MPH program. Prior to becoming Department Chair, he served as the Department’s Vice Chair for Education and is the inaugural holder of an endowed Directorship in Health Policy Education.\n\nDr. Stevenson received a BA in religion from Oberlin College, a SM in health policy and management from the Harvard School of Public Health, and a PhD in Health Policy from Harvard University. Prior to starting at Vanderbilt, his previous faculty appointment was in the Department of Health Care Policy at Harvard Medical School.',
  },
  {
    name: 'Dr David C. Grabowski',
    role: 'Co-Director',
    photo: '/bios/dr-grabowski.jpg',
    bio: 'David C. Grabowski, PhD, is a professor of health care policy in the Department of Health Care Policy at Harvard Medical School. His research examines the economics of aging with a particular interest in the areas of long-term care and post-acute care. He is a member of the National Academy of Medicine.\n\nHe has published over 300 peer-reviewed articles, and his work has appeared in leading peer-reviewed journals of economics, health policy, and medicine, including the Review of Economics & Statistics, Health Affairs, the Journal of Health Economics, and the New England Journal of Medicine. His work has been featured by prominent popular press outlets, such as the Wall Street Journal, National Public Radio, the Washington Post, and the New York Times. He has testified to Congress on seven separate occasions.\n\nDr. Grabowski’s research has been supported by the National Institute on Aging, the Agency for Healthcare Research and Quality, and the Centers for Medicare and Medicaid Services (CMS). His research has also been funded by several private foundations including the Robert Wood Johnson Foundation, Commonwealth Fund, Arnold Foundation, Donaghue Foundation, and Warren Alpert Foundation.\n\nFrom 2017 through 2023, Dr. Grabowski was a member of the Medicare Payment Advisory Commission (MedPAC), which is an independent agency established to advise the U.S. Congress on issues affecting the Medicare program. He has also served on several CMS technical expert panels. During the pandemic, he served on the CMS Nursing Home Coronavirus Commission. He was also a member of the National Academy of Sciences, Engineering, and Medicine Committee on the Quality of Care in Nursing Homes.\n\nHe is an associate editor of the journal Forum for Health Economics and Policy, and he is a member of the editorial boards of the American Journal of Health Economics and the Journal of the American Medical Directors Association. He was the 2004 recipient of the Thompson Prize for Young Investigators from the Association of University Programs in Health Administration. Dr. Grabowski received his BA from Duke University and his PhD in public policy from the Irving B. Harris School of Public Policy at the University of Chicago.',
  },
  {
    name: 'Dr Robert Skinner',
    role: 'Postdoctoral Associate',
    photo: '/bios/robbie-skinner.jpg',
    bio: 'Dr. Robert Skinner is a Postdoctoral Associate in the Division of Health Policy and Economics at Weill Cornell Medicine. He earned his PhD in Health Policy and Health Services Research from Vanderbilt University in 2026.\n\nHis research focuses broadly on population aging, with particular emphasis on nursing home regulation and oversight, as well as the markets and institutions that support long-term care for older adults. His dissertation examined how inspector networks influence nursing home oversight and how state agencies vary in their approaches to regulation and enforcement.\n\nPrior to pursuing an academic career, Dr. Skinner worked as a contractor for the Centers for Medicare & Medicaid Services (CMS), where he analyzed provider certification and survey data and contributed to projects modeling health care spending across diseases and treatment settings.',
  },
  {
    name: 'Rahul Joseph Fernandez',
    role: 'Director of Analytics',
    photo: '/bios/rahul-fernandez.jpg',
    bio: 'Rahul Fernandez is a Senior Research Assistant in the Department of Population Health Sciences at Weill Cornell Medicine, where he works with Dr Tyler Braun and collaborators on several data driven research avenues within the larger healthcare space.\n\nRahul has a Masters of Science in Biostatistics and Data Science from Weill Cornell Medicine, and a Bachelors in Economics with a minor in Biology from Azim Premji University.',
  },
  {
    name: 'Yuting Fan',
    role: 'Research Assistant',
    photo: '/bios/yuting-fan.jpg',
    bio: 'Yuting Fan is a software engineer with a background in data science, focused on building intelligence systems from complex public data.\n\nFor this project, Yuting designed and implemented core components of a multi-source acquisition intelligence platform, developing data integration pipelines, entity resolution workflows, and automated validation processes that transform fragmented regulatory signals into reliable transaction intelligence.\n\nYutings interests lie in building data-intensive systems that bridge software engineering, large-scale information integration, and real-world decision making.',
  },
];

function PersonCard({ name, role, photo, bio }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
      <img
        src={photo}
        alt={name}
        loading="lazy"
        className="h-32 w-32 flex-none rounded-full object-cover object-top ring-1 ring-black/5"
      />
      <div className="min-w-0">
        <Heading level={3}>{name}</Heading>
        {role && (
          <p className="text-label-sm text-content-secondary mt-0.5 tracking-wide uppercase">
            {role}
          </p>
        )}
        <div className="mt-3 space-y-4">
          {bio.split('\n\n').map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="text-paragraph-base text-content-primary max-w-prose leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

PersonCard.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string,
  photo: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired,
};

export default function About() {
  return (
    <div className="bg-background-secondary font-sans">
      <LayoutPage>
        <div className="py-8">
          <Heading level={1} className="text-display-xs">
            Who&apos;s involved
          </Heading>
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-x-12">
            {people.map((person) => (
              <PersonCard key={person.name} {...person} />
            ))}
          </div>
        </div>
      </LayoutPage>
    </div>
  );
}
