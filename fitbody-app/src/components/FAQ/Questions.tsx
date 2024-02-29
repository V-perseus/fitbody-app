import React from 'react'
import { Text } from 'react-native'
import styles from './styles'
import { checkAndRedirect } from '../../config/utilities'

type DescriptionProps = {
  showModal: (url: string) => void
}
const Questions = {
  community: [
    {
      title: 'Does Anna provide information on all things fitness and food?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          Yes! One of the many amazing parts of the Fit Body App is all the information, education and guidance Anna provides. The Guidance
          Video section of the app provides a plethora of need-to-know information and insight to help you learn how to live a sustainable,
          lifestyle. The Guidance Video Section covers videos on all types of cardio, how to find your maximum heart rate, breathing
          techniques, macronutrients, healthy eating tips and so much more!
        </Text>
      ),
    },
    {
      title: 'How do I join the Fit Body community?',
      description: (props: DescriptionProps) => (
        <Text style={styles.textFieldsAnswer}>
          The Fit Body community primarily exists on Instagram. Once you have joined the Fit Body app, or downloaded the Fit Body Guides,
          you can simply go to Instagram and create your own fitness accountability Instagram account.{'\n'}
          {'\n'}
          Once it’s created, search the tags <Text style={styles.boldText}>#fitbodyapp #fbggirls #fbgcommunity</Text> to find fellow FBG
          girls and start connecting, encouraging, and sharing your fitness journey!{'\n'}
          {'\n'}
          You can also connect through the
          <Text style={styles.boldText} onPress={() => props.showModal('https://www.facebook.com/groups/fitbodyapp')}>
            {' '}
            Fit Body Community{' '}
          </Text>
          group on Facebook!
        </Text>
      ),
    },
    {
      title: 'Why do I need to create a second Instagram account to join the community?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          In Anna's experience helping thousands of women transform their lives and their bodies, she has found that people are much more
          likely to see success when they are involved in a like-minded community.{'\n'}
          {'\n'}If someone uses their personal Instagram account, they are much less likely to share their struggles openly and honestly
          since their family, friends, and peers are watching. Joining the FBG community gives you a safe place to track your fitness
          journey and to be held accountable.{'\n'}
          {'\n'}Our members who are involved with the FBG community have a success rate of 83% for their fitness journey, but you always
          have the option to put your page on private if you have any privacy concerns.
        </Text>
      ),
    },
    {
      title: 'How do I find others in the community?',
      description: (props: DescriptionProps) => (
        <Text style={styles.textFieldsAnswer}>
          You can follow our Instagram page
          <Text style={styles.boldText} onPress={() => props.showModal('https://www.instagram.com/fitbodyapp/')}>
            {' '}
            @fitbodyapp{' '}
          </Text>
          or search the hastags <Text style={styles.boldText}>#fitbodyapp #fbggirls #fbgcommunity</Text> to connect with fellow FBG members!
          {'\n\n'}
          You can also connect with members through the
          <Text style={styles.boldText} onPress={() => props.showModal('https://www.facebook.com/groups/fitbodyapp')}>
            {' '}
            Fit Body Community{' '}
          </Text>
          group on Facebook!
        </Text>
      ),
    },
    {
      title: 'Where can I find weekly tips and encouragement?',
      description: (props: DescriptionProps) => (
        <Text style={styles.textFieldsAnswer}>
          To make any journey a successful one, providing support and encouragement is key. In the Fit Body app, we have Guidance Videos, in
          our On Demand section, from Anna, that offer tips and encouragement.{'\n'}
          {'\n'}
          You can find additional tips through the
          <Text style={styles.boldText} onPress={() => props.showModal('https://www.instagram.com/fitbodyapp/')}>
            {' '}
            @fitbodyapp{' '}
          </Text>{' '}
          Instagram and with our weekly FBG newsletter, as well as our other trainers' social channels.
          {'\n\n'}
          You can find each of them on Instagram at:{'\n\n'}Anna Victoria: @annavictoria{'\n'}Nicci: @nicci_robinson{'\n'}Martina:
          @martina_sergi{'\n'}Brittany: @_brittanylupton{'\n'}
          {'\n'}You can always connect through the
          <Text style={styles.boldText} onPress={() => props.showModal('https://www.facebook.com/groups/fitbodyapp')}>
            {' '}
            Fit Body Community{' '}
          </Text>{' '}
          group on Facebook!
        </Text>
      ),
    },
  ],
  meals: [
    {
      title: 'Does my Fit Body membership come with access to a Registered Dietitian?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          Yes! This is an exclusive service for our app members.{'\n'}
          {'\n'}You get free consultations and access to the Fit Body Registered Dietitian included in your membership. She will be able to
          help guide you on food allergies or sensitivities, questions about nutrition regarding a variety of conditions like diabetes or
          thyroid disorders, and more!{'\n'}
          {'\n'}You can contact her at{' '}
          <Text style={styles.boldText} onPress={() => checkAndRedirect('nutrition@fitbodyapp.com')}>
            nutrition@fitbodyapp.com
          </Text>{' '}
          or through the app's Contact Us button.
        </Text>
      ),
    },
    {
      title: 'How is the meal plan structured?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          The Fit Body app has an extensive meal plan section that offers several solutions for your nutrition goals and needs!
          {'\n\n'}
          Use the food tracker to input your own ingredients, branded food items, or recipes with custom macros and calories; add individual
          recipes provided by the Fit Body app; or select an entire meal set that is pre-calculated to your personal macro and caloric
          needs. Current meal plans available: Regular, Vegan, Vegetarian, Pescatarian, Gluten Free + Dairy Free, and Keto.
        </Text>
      ),
    },
    {
      title: 'How many calories are in the meal plans?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          One of the best features about the Fit Body app is that the meal plans are calculated according to your caloric needs! Scroll
          through our 72 meal plan sets and find one that best suits your fitness goals.{'\n'}
          {'\n'}If you want to mix and match recipes, you can always pull from the 300+ individual recipes and add it to your daily food
          tracker. You will be able to see how many calories are in each meal, so you can pick according to your calorie intake, and even
          adjust the portions to each recipe to fit your caloric needs for the day!
        </Text>
      ),
    },
    {
      title: 'Is the meal plan macro friendly?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          Yes! The Fit Body meal plans are designed to meet your exact macronutrient needs. The meals are designed to give you the best
          solution to eating healthy and according to your goals.{'\n'}
          {'\n'}The macros in the meal plan are calculated according to a 30% protein, 40% carbs, and 30% fats macro ratio. All the hard
          work of calculating your macros and proteins are included in your Fit Body membership, in the Meals section in our app!
        </Text>
      ),
    },
    {
      title: 'Does the app have plant-based options?',
      description: <Text style={styles.textFieldsAnswer}>Yes! The Fit Body app has a vegetarian and vegan meal plans available!</Text>,
    },
    {
      title: 'Still have a question about the meals not answered here?',
      description: (
        <Text style={styles.textFieldsAnswer} onPress={() => checkAndRedirect('hello@fitbodyapp.com')}>
          Click <Text style={styles.boldText}>here</Text> to contact us!
        </Text>
      ),
    },
  ],
  support: [
    {
      title: 'Is the Fit Body app available worldwide?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          Yes! The Fit Body app is available for all iOS and Android, Oreo+ and up, smartphone users worldwide!
        </Text>
      ),
    },
    {
      title: 'Which platforms offer the Fit Body app?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          The Fit Body app is available on the iTunes App Store and Google Play store.{'\n'}
          {'\n'}
          <Text style={styles.boldText}>Note:</Text> The Fit Body app is not optimized for iPads/Tablets and is not available for desktop
          browsers.
        </Text>
      ),
    },
    {
      title: 'What are membership plans? How much do they cost?',
      description: (props: DescriptionProps) => (
        <Text style={styles.textFieldsAnswer}>
          We offer a 7 day trial period of the Fit Body app no matter what plan you choose or way you sign up! There are two different
          membership options we offer: a month-by-month plan or the 12 month plan.{'\n'}
          {'\n'}The pricing for each membership can be seen on the home page:
          <Text style={styles.boldText} testID="link_btn" onPress={() => props.showModal('https://join.fitbodyapp.com')}>
            {' '}
            join.fitbodyapp.com{' '}
          </Text>{' '}
        </Text>
      ),
    },
    {
      title: 'Do you offer a military/student/healthcare discount?',
      description: (props: DescriptionProps) => (
        <Text style={styles.textFieldsAnswer}>
          Yes! We do offer discounts for active military, enrolled students, and healthcare workers! This is available for accounts that
          were enrolled through our website{' '}
          <Text style={styles.boldText} onPress={() => props.showModal('https://join.fitbodyapp.com')}>
            join.fitbodyapp.com.
          </Text>
          {'\n\n'}To get the discount, just email our team at{' '}
          <Text style={styles.boldText} onPress={() => checkAndRedirect('hello@fitbodyapp.com')}>
            hello@fitbodyapp.com
          </Text>{' '}
          and make sure to attach the proof to the email (student ID, military ID, hospital badge, etc.) and include the email you signed up
          with!
        </Text>
      ),
    },
    {
      title: 'How do I change my membership plan?',
      description: (props: DescriptionProps) => (
        <Text style={styles.textFieldsAnswer}>
          <Text style={styles.boldText}>If you signed up through iTunes:{'\n'}</Text>
          Go into your App Store app → Click on your Profile in the upper right hand corner → Subscriptions → Find your Fit Body app
          subscription and change your membership accordingly.{'\n'}
          {'\n'}
          <Text style={styles.boldText}>If you signed up through Google Play:{'\n'}</Text>
          Launch the Google Play Store app. Tap Menu → My Apps → Subscriptions → Fit Body app → Click Cancel and Yes to confirm. At the end
          of your current billing cycle, you can sign back up for the new membership of choice using the same email as before.{'\n'}
          {'\n'}
          <Text style={styles.boldText}>If you signed up through our website:{'\n'}</Text>
          Please go to
          <Text style={styles.boldText} onPress={() => props.showModal('https://join.fitbodyapp.com')}>
            {' '}
            join.fitbodyapp.com{' '}
          </Text>{' '}
          → Sign into your account and you'll be at your Account Profile → Your Membership will allow you to make the changes accordingly.
        </Text>
      ),
    },
    {
      title: 'How do I cancel my membership?',
      description: (props: DescriptionProps) => (
        <Text style={styles.textFieldsAnswer}>
          <Text style={styles.boldText}>If you signed up through iTunes:{'\n'}</Text>
          Go into your App Store app → Click on your Profile in the upper right hand corner → Subscriptions → Find your Fit Body app
          subscription and hit cancel.{'\n'}
          {'\n'}
          <Text style={styles.boldText}>If you signed up through Google Play:{'\n'}</Text>
          Launch the Google Play Store app. Tap Menu → My Apps → Subscriptions and tap on Fit Body app → Click Cancel and Yes to Confirm.
          {'\n'}
          {'\n'}
          <Text style={styles.boldText}>If you signed up through our website:{'\n'}</Text>
          Go to{' '}
          <Text style={styles.boldText} onPress={() => props.showModal('https://join.fitbodyapp.com')}>
            {' '}
            join.fitbodyapp.com{' '}
          </Text>
          → Sign into your account and you'll be at your Account Profile page and from there you can see the option to cancel on the right
          side.
        </Text>
      ),
    },
    {
      title: 'How do I watch the On Demand classes on my TV?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          <Text style={styles.boldText}>iOS:</Text>
          {'\n'}
          <Text style={styles.boldText}>Screen mirroring with Apple TV</Text>
          {'\n'}
          1. Make sure your Apple TV is set up with your TV.{'\n'}
          2. Go to your iPhone swipe-up menu and click the ‘Screen Mirroring’ button.{'\n'}
          3. Select the TV/Device you would like to use.{'\n'}
          4. Go to the Fit Body app and start your workout of choice!{'\n\n'}
          <Text style={styles.boldText}>Screen mirroring with a Roku enabled device (Roku stick or Roku TV)</Text>
          {'\n'}
          1. Go to your iPhone swipe-up menu and click the ‘Screen Mirroring’ button.{'\n'}
          2. Select your Roku device.{'\n'}
          3. Enter the code from your TV on your iPhone.{'\n'}
          4. Tap OK and go to the Fit Body app to start your workout of choice!{'\n\n'}
          <Text style={styles.boldText}>Chromecast with a Chromecast enabled device</Text>
          {'\n\n'}
          <Text style={styles.boldText}>NOTE:</Text> Casting is available when both devices are on the same WiFi network and within casting
          range.{'\n\n'}
          1. Connect your iPhone to the same WiFi network your Chromecast is connected to.{'\n'}
          2. Open the Fit Body app and go to the On Demand class you would like to watch.{'\n'}
          3. Tap the casting icon in the top right corner.{'\n'}
          4. Select your Chromecast device and cast screen.{'\n'}
          5. Start your workout!{'\n\n'}
          <Text style={styles.boldText}>Android:</Text>
          {'\n'}
          <Text style={styles.boldText}>Chromecast with a Chromecast enabled device:</Text>
          {'\n'}
          1. Connect your phone to the same internet your Chromecast is connected to.{'\n'}
          2. Open the Fit Body app and go to the On Demand class you would like to watch.{'\n'}
          3. Tap the casting icon in the top right corner.{'\n'}
          4. Select your Chromecast device and cast screen.{'\n'}
          5. Start your workout!{'\n\n'}
          <Text style={styles.boldText}>Smart View on TV’s with Smart View capability</Text>
          {'\n'}
          1. Swipe from the top down to see your Notifications menu.{'\n'}
          2. Tap the ‘Smart View’ button.{'\n'}
          3. Choose your Smart View enabled device and your phone screen will be shown on your TV.{'\n'}
          4. Go to the Fit Body app and start your workout of choice!
        </Text>
      ),
    },
    {
      title: 'Still have a question about your membership not answered here?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          Click
          <Text style={styles.boldText} onPress={() => checkAndRedirect('hello@fitbodyapp.com')}>
            {' '}
            here{' '}
          </Text>
          to contact us!
        </Text>
      ),
    },
  ],
  workouts: [
    {
      title: 'I picked a trainer and chose a program - now what?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          You're ready to crush your first workout!{'\n\n'}
          Whether it's a strength workout, cardio workout, or a quick core workout, you can choose what workouts works best for you each
          day!{'\n\n'}
          The goal is to complete all the workouts by the end of the week. If you want to "double up" and do 2 workouts (combining a cardio
          workout with a core session, for example), that's a great way to decrease your workout days and increase your rest time.
          {'\n\n'}
          No matter what, as long as you're checking those workouts off, you're killing it!
        </Text>
      ),
    },
    {
      title: 'I don’t have access to a gym - which programs can I do?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          No gym? No problem! Most of our programs are designed to be done at home with either minimal equipment (a few sets of dumbbells)
          or no equipment at all! If you don’t have any equipment at all, <Text style={styles.boldText}>Shred</Text> is the perfect program
          for you. <Text style={styles.boldText}>Move</Text> and <Text style={styles.boldText}>Rise</Text>, our yoga-inspired programs, only
          require a block and a strap which can easily be substituted for things you find around the house. If you have a few sets of
          dumbbells (or even a few heavy household items), you can crush <Text style={styles.boldText}>Tone</Text> and{' '}
          <Text style={styles.boldText}>Endurance</Text>! You can also do <Text style={styles.boldText}>Revive</Text> as long as you have a
          resistance band!
        </Text>
      ),
    },
    {
      title: 'What fitness level is the Fit Body app designed for?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          The Fit Body app is perfect for any fitness level. There are 3 levels to choose from to customize the program to fit your needs:
          beginner, intermediate, and advanced. As you grow stronger, you can always adjust the level to meet your needs!
        </Text>
      ),
    },
    {
      title: 'What is the difference between each program in the Fit Body app?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          Fit Body offers 4 different trainers that offer different programs based on your personal goals and needs:{'\n\n'}
          <Text style={styles.boldText}>Anna Victoria’s Programs</Text>
          {'\n'}
          <Text style={styles.boldText}>SHRED</Text> is designed for ultimate fat loss and utilizes only bodyweight-based exercises, so no
          equipment is required. Shred is the perfect program for those who need to work out at home and have no equipment. Each strength
          workout is 30 minutes.{'\n'}
          <Text style={styles.boldText}>TONE</Text> is designed for both fat loss and toning muscle. Workouts can be done at the gym or at
          home as only dumbbells are required. Each strength workout is 30 minutes.{'\n'}
          <Text style={styles.boldText}>SCULPT</Text> is designed primarily for gaining strength and lifting weights and perfect for those
          who are comfortable with gym machines. Each strength workout is 45 minutes.{'\n'}
          <Text style={styles.boldText}>GROW + GLOW</Text> is a pregnancy-safe, low impact workout program designed to coincide with your
          specific week/trimester of pregnancy. Workouts can be done at home or at the gym and require dumbbells, a pilates ball, and a
          stability ball. Each strength workout is 30 minutes.
          {'\n\n'}
          <Text style={styles.boldText}>Nicci's Programs</Text>
          {'\n'}
          <Text style={styles.boldText}>ENDURANCE</Text> is an at-home, high intensity interval program designed to improve your endurance,
          increase your cardiovascular ability, and burn fat. This program only requires dumbbells and is ideal for those looking to improve
          athletic ability and strength from home. Each strength workout is 30 minutes.{'\n'}
          <Text style={styles.boldText}>STRONG</Text> is created for ultimate body transformation. This is designed to burn fat while
          buildinglean muscle. It heavily incorporates gym equipment for max resistance training to help tone, shape, and build. Each
          strength workout ranges from 60-90 minutes.{'\n\n'}
          <Text style={styles.boldText}>Brittany’s Programs</Text>
          {'\n'}
          <Text style={styles.boldText}>LIFT</Text> is a gym-based program primarily designed for gaining strength and lifting weights while
          also introducing gym workouts to those who might be unfamiliar. Each strength workout ranges from 45-60 minutes.{'\n'}
          <Text style={styles.boldText}>REVIVE</Text> is a postpartum program designed for regaining strength and restoring your core. This
          program utilizes minimal equipment workouts to safely ease you back into working out. Each strength workout is 30 minutes.{'\n\n'}
          <Text style={styles.boldText}>Martina’s Programs</Text>
          {'\n'}
          <Text style={styles.boldText}>MOVE</Text> is a yoga-inspired program designed to increase your mobility and flexibility. Perfect
          for any level, Move can be done at home and only requires a mat, a strap, and blocks. Each workout ranges from 30-40 minutes.
          {'\n'}
          <Text style={styles.boldText}>RISE</Text> is a yoga-inspired program designed to help you increase strength. This program is ideal
          for all fitness levels and those looking to lengthen and strengthen their muscles through bodyweight movements. Each workout
          ranges from 25-35 minutes.
        </Text>
      ),
    },
    {
      title: 'I work better on a schedule - how do I go about creating one for myself?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          We purposefully don’t have a set schedule in the Fit Body app so it’s easier to make a fitness routine that works for your
          schedule, but we know that sometimes a set schedule can be preferred. An example of a schedule that works for programs like Shred
          and Tone is:{'\n\n'}
          Monday: Legs/Glutes{'\n'}
          Tuesday: Cardio + Core{'\n'}
          Wednesday: Upper Body{'\n'}
          Thursdays: Cardio + Core{'\n'}
          Friday: Full Body{'\n'}
          Saturday: Cardio + (Optional) Core{'\n'}
          Sunday: Rest day{'\n\n'}
          <Text style={styles.boldText}>Note:</Text> Not all of the programs in the app have 9 workouts. The best rule to remember is make
          sure you are alternating muscle group each day so your muscles have time to recover! We also do not recommend combining 2 strength
          days, so if you're "doubling up" one day, it's best to add cardio with a core or strength workout.
        </Text>
      ),
    },
    {
      title: 'What is the “5 Minute Cardio Burn” and how do I use it?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          The 5 Minute Cardio Burn is a daily workout designed to be used as a warmup or an extra push after your workout! It is completely
          optional and can be used multiple times to create a cardio workout on that day!
        </Text>
      ),
    },
    {
      title: 'I have an injury/condition that prevents me from doing some of the moves. How do I safely modify or replace them?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          Your Fit Body app membership comes with free access to our team's Physical Therapist. She is available and happy to assist you
          with any modifications or substitutions you may need, as well as any other questions you might have. Just email{' '}
          <Text style={styles.boldText} onPress={() => checkAndRedirect('pt@fitbodyapp.com')}>
            pt@fitbodyapp.com!
          </Text>
        </Text>
      ),
    },
    {
      title: 'What is the difference between "reps" and "rounds"?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          Reps and rounds both indicate how many times an exercise should be performed. The difference is that "reps" refer to an exercise
          with a singular move and "rounds" refers to an exercise that combines 2 or more moves.
        </Text>
      ),
    },
    {
      title: 'Does the weight recommendation for barbell moves include the barbell?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          The weight listed is the total weight, which should include the weight of your barbell. Standard Olympic barbells are 44lbs/20kg,
          but if you are unsure whether your barbell is the Standard Olympic weight, make sure to check with your gym's staff.
        </Text>
      ),
    },
    {
      title: 'Does the recommended weight refer to each dumbbell or the combination of the two?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          The recommended weight is for each dumbbell shown in the exercise. If an exercise requires 2 dumbbells, the weight refers to each
          dumbbell, but if the exercise only requires the use of 1 dumbbell, the weight would be for that 1.
        </Text>
      ),
    },
    {
      title: 'Are there stretching and foam rolling videos?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          Yes! We are huge advocates for stretching, foam rolling, and overall rehabilitation in order to prevent injuries. Anna Victoria
          has Guidance videos about these in the On Demand section of the app.
        </Text>
      ),
    },
    {
      title: 'What are the On Demand classes and Guidance videos?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          The On Demand classes are 10 to 30 minute, follow-along video workouts. You can supplement your current Fit Body routine with the
          Cardio, Low Impact, and Yoga Flow classes available!{'\n\n'} The Guidance Videos are motivational pep talks and informative videos
          from Anna Victoria, that can help out no matter where you are in your fitness journey.{'\n\n'}
          We also offer the Restore Your Core series for newly postpartum and post c-section moms!
        </Text>
      ),
    },
    {
      title: 'How do the On Demand classes fit into my current program’s schedule?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          With Fit Body, there is a level of customization offered to allow this app to work with your schedule. You can replace any cardio
          days with an On Demand Cardio or Low Impact class.{'\n\n'}
          If you are doing the Endurance or Shred programs, you can also pick a Cardio class to replace that day's Endurance or Shred
          workout. {'\n\n'}
          For Lift, there's one dedicated Cardio + Core day, so you can always choose an On Demand Cardio or Low Impact class instead of
          doing traditional cardio.
        </Text>
      ),
    },
    {
      title: 'Can the Low Impact classes be done when pregnant?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          The Low Impact classes are not designed for pregnancy, but we do offer a program that is specifically designed for expecting
          mothers. Make sure to check out Anna Victoria's Grow + Glow program!
        </Text>
      ),
    },
    {
      title: 'Can the Yoga Flow classes be added to any program on a recovery/rest day?',
      description: <Text style={styles.textFieldsAnswer}>Yes! You can do a Yoga Flow class on a recovery or rest day.</Text>,
    },
    {
      title: 'Can I just do On Demand classes instead of a program?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          We suggest sticking to the guided programs offered by our trainers for your optimal progress. Our On Demand classes would be best
          utilized for cardio or additional workouts, as wanted.
        </Text>
      ),
    },
    {
      title: 'What equipment do I need for On Demand classes?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          Some On Demand classes have no equipment and some require dumbbells, a platform, or a resistance band. If you are a beginner doing
          a Yoga Flow class, you may need blocks or straps.
        </Text>
      ),
    },
    {
      title: 'I finished all the classes, now what?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          Great job! You can repeat the programs as many times as you would like, we offer the option to change the intesity of the classes
          to whatever you are comfortable with. This allows you to continue to track your progress and see how much stromnger and faster you
          are getting during your fitness journey!{'\n\n'}
          Stay tuned for new workout classes being added!
        </Text>
      ),
    },
    {
      title: 'Which postpartum program should I follow?',
      description: (
        <Text style={styles.textFieldsAnswer}>
          Once you have received your doctor's clearance to exercise, we offer 2 postpartum programs in the Fit Body app.{'\n\n'}
          One is the 12 week program, Revive with Brittany Lupton, and the other is 8 classes offered in our On Demand section, Restore Your
          Core with Anna Victoria.{'\n\n'}
          These programs are specifically designed for those who are newly postpartum and post C-section. Regardless of your birth
          experience, you can follow Restore Your Core if you are wanting to focus on healing your core postpartum or post-surgery.
        </Text>
      ),
    },
    {
      title: 'Still have a question about workouts not answered here?',
      description: (
        <Text style={styles.textFieldsAnswer} onPress={() => checkAndRedirect('hello@fitbodyapp.com')}>
          Click
          <Text style={styles.boldText}> here </Text>
          to contact us!
        </Text>
      ),
    },
  ],
}

export default Questions
