import { BiUser, BiBriefcase, BiBook, BiAward, BiGlobe, BiLink } from "react-icons/bi";
import Tabs from "../../ui/tabs/Tab";
import AvatarAndBanner from "./profile-edit-components/avatar-and-banner/AvatarAndBanner";
import { ImImage } from "react-icons/im";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../types/Types";
import BasicDetails from "./profile-edit-components/basic-detials/BasicDetails";
import AddressDetails from "./profile-edit-components/basic-detials/AddressDetails";
import ExperienceDetails from "./profile-edit-components/experience/Experience";
import EducationDetails from "./profile-edit-components/education/Education";
import SkillsDetails from "./profile-edit-components/skills/Skills";
import LanguageDetails from "./profile-edit-components/language/Language";
import SocialLinks from "./profile-edit-components/social-links/SocialLinks";

export default function ProfileEdit() {
  const { authUser } = useOutletContext<DashboardOutletContextProps>();
  const tabData = [
    {
      label: "Avatar & Banner",
      value: "avatar-and-banner",
      icon: <ImImage />,
      component: <AvatarAndBanner user={authUser} />,
    },
    {
      label: "Basic Details",
      value: "basic-details",
      icon: <BiUser />,
      component: (
        <>
          <BasicDetails />
          <AddressDetails />
        </>
      ),
    },
    {
      label: "Experience",
      value: "experience",
      icon: <BiBriefcase />,
      component: <ExperienceDetails />,
    },
    {
      label: "Education",
      value: "education",
      icon: <BiBook />,
      component: <EducationDetails />,
      hide: false,
    },
    {
      label: "Skills",
      value: "skills",
      icon: <BiAward />,
      component: <SkillsDetails />,
      hide: false,
    },
    {
      label: "Languages",
      value: "languages",
      icon: <BiGlobe />,
      component: <LanguageDetails />,
      hide: false,
    },
    {
      label: "Social Links",
      value: "social-links",
      icon: <BiLink />,
      component: <SocialLinks />,
      hide: false,
    },
  ];

  return (
    <div>
      <Tabs tabs={tabData} defaultTab="basic-details" paramKey="tab" />
    </div>
  );
}
