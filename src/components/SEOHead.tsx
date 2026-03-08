import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description?: string;
}

const SEOHead = ({ title, description }: SEOHeadProps) => {
  useEffect(() => {
    const fullTitle = `${title} | InterviewAI`;
    document.title = fullTitle;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(name.startsWith("og:") ? "property" : "name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description);
    }
    setMeta("og:title", fullTitle);
  }, [title, description]);

  return null;
};

export default SEOHead;
