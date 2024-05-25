import { Link } from "react-router-dom";
import cityImg from "../assets/city.jpg";
import heroImg from "../assets/hero.png";
import Footer from "../components/Footer";
import { motion, useScroll, useTransform } from 'framer-motion';

export default function WelcomePage() {

  const {scrollY} =useScroll();

  const opacityCity = useTransform(scrollY, [0, 200, 300, 500], [1, 0.5, 0.5, 0]);
  const yCity = useTransform(scrollY, [0, 200], [0, -100]);

  const opacityHero = useTransform(scrollY, [0, 300, 500], [1, 1, 0]);
  const yHero = useTransform(scrollY, [0, 200], [0, -150]);

  const scaleText = useTransform(scrollY, [0, 300], [1, 1.5]);
  const yText = useTransform(scrollY, [0, 200, 300, 500], [0, 50, 50, 300]);


  return (
    <>
      <header id="welcome-header">
        <motion.div     id="welcome-header-content" style={{ scale: scaleText, y: yText }} >
          <h1>도전할 준비가 되셨나요?</h1>
          <Link id="cta-link" to="/challenges">
            시작
          </Link>
        </motion.div>
        <motion.img          
          style={{opacity:opacityCity , y:yCity}}
          src={cityImg}
          alt="햇빛이 닿은 도시의 스카이라인"
          id="city-image"
        />
        <motion.img src={heroImg} alt="망토를 쓴 슈퍼히어로" id="hero-image" style={{opacity:opacityHero , y:yHero}} />
      </header>
      <main id="welcome-content">
        <section>
          <h2>이보다 더 좋은 때는 없었습니다.</h2>
          <p>
            우리 플랫폼을 사용하면 다음과 같은 과제를 설정, 추적 및 극복할 수
            있습니다. 당신만의 속도. 개인적 성장이든, 직업적이든 업적을
            달성하거나 재미를 위해 모든 것을 도와드립니다.
          </p>
        </section>
        <section>
          <h2>도전해야 하는 이유?</h2>
          <p>
            도전은 성장을 위한 틀을 제공합니다. 그들은 경계를 허물고, 한계를
            테스트하고 진정한 발전을 가져옵니다. 여기, 우리는 믿습니다 모든
            사람은 아직 개발되지 않은 잠재력을 갖고 있으며 잠금 해제되기를
            기다리고 있습니다.
          </p>
        </section>

        <section>
          <h2>기능</h2>
          <ul>
            <li>맞춤형 챌린지 생성: 규칙을 설정하고 속도를 정의하세요.</li>
            <li>
              진행 상황 추적: 분석을 통해 시간 경과에 따른 성장을 확인하세요.
              도구.
            </li>
            <li>
              커뮤니티 지원: 커뮤니티에 가입하고 동료들로부터 동기를
              부여받으세요.
            </li>
          </ul>
        </section>

        <section>
          <h2>도전을 받아들이는 수천 명의 사람들과 함께하세요</h2>
          <p>
            “나는 처음으로 목표를 세울 때까지 내가 무엇을 할 수 있는지 전혀
            깨닫지 못했습니다. 여기에 도전하세요. 정말 획기적인 경험이었습니다!”
            - 알렉스 피.
          </p>
          {/* You can add more testimonials or even a carousel for multiple testimonials */}
        </section>
      </main>
      <Footer />
    </>
  );
}
