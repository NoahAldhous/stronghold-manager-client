"use client";

import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "contexts/AuthContext";
import CreateItemModal from "components/CreateItemModal/CreateItemModal";
import Tooltip from "components/Tooltip/Tooltip";

export default function StrongholdCreator(){

    const { isLoggedIn, logout, userId, userName } = useAuth();

    // STATE DECLARATION

    //for navigating the user back to login page if no valid token is found
    const router = useRouter();

    //isFormComplete
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)

    //is the create button being hovered, used for showing tooltip
    const [hovered, setHovered] = useState(false); 

    //used to progress through the stages of the stronghold creator menu
    const [progress, setProgress] = useState(1);

    //displays the modal when the created stronghold is being sent to database
    const [displayModal, setDisplayModal] = useState(false);

    //receive the newly created stronghold's id for navigation to the stronghold page
    const [strongholdId, setStrongholdId] = useState(0);

    //create loading UI when queries are being made /data is being fetched
    const [loading, setLoading] = useState(false);

    //acquisition type. TODO: update API and add this to userStronghold
    const [activeAcquisitionType, setActiveAcquisitionType] = useState({
        type:"built",
        displayName:"built from scratch",
        description:"You have raised this stronghold from the ground up. It is built in your vision, may it serve you well.",
        multiplierText:"Standard time and build costs.",
        multiplier: 1
    });

    //user options to be fetched from database
    const [strongholdTypes, setStrongholdTypes] = useState([
        {
          type_name: "",
          type_description:"",
          id: 0,
        },
    ]);

    const [typeFeatures, setTypeFeatures] = useState([
        {
            featureDescription: "",
            featureName: "",
            id: 0,
            typeId: 0,
            typeName: ""
        }
    ])

    const [typeStats, setTypeStats] = useState({stats: {
        keep: {
            level1: {
            costToBuild: 0,
            costToUpgrade: 0,
            fortificationBonus: 0,
            size: 0,
            level:0,
            timeToBuild: 0,
            timeToUpgrade: 0,
            toughness: 0
            }
        }
    }})

    //user options to be fetched from database
    const [strongholdClasses, setStrongholdClasses] = useState([{
        id: 0,
        name: "",
        strongholdDescription: "",
        strongholdName: "",
        demesneEffects: [
        {
            description: ""
        }
        ],
        featureImprovement: {
        name: "",
        description: "",
        restriction: ""
        },
        strongholdActions: [
        {
            name: "",
            description: ""
        }
        ]
    }]);

    //user stronghold options which will be sent to database
    const [userStronghold, setUserStronghold] = useState({
        user_id: userId,
        stronghold_name: "",
        owner_name: "",
        stronghold_level: 1,
        stronghold_type: "keep",
        stronghold_class: "barbarian"
    });

    // hard-code levels and acquisition type for simplicity
    //TODO: fetch acquisition types from db instead
    const levels = [1, 2, 3, 4, 5];
    const acquisitionTypes = [
        {
            type:"built",
            displayName:"built from scratch",
            description:"You have raised this stronghold from the ground up. It is built in your vision, may it serve you well.",
            multiplierText:"Standard time and build costs.",
            multiplier: 1
        },
        {
            type:"repaired",
            displayName:"repaired a ruin",
            description:"You have claimed an old ruined stronghold. A bit of work and it will good as new!",
            multiplierText:"Time and build costs are halved.",
            multiplier: 0.5
        },
        {
            type:"bestowed",
            displayName:"bestowed upon",
            description:"You were gifted this stronghold from a powerful figure, such as a noble, monarch, or a wealthy relative.",
            multiplierText:"No build costs. Available immediately.",
            multiplier: 0
        }
    ]

    // NAVIGATION

    function handleNavigate(){
        router.push("/")
    }

    // STATE HANDLING

    function incrementProgress(){
        if ( progress < 4 ){
            setProgress(progress => progress+1)
        }
    };

    function decrementProgress(){
        if (progress > 1){
            setProgress(progress => progress-1)
        }
    };

    function handleStrongholdTypeChange(type: string) {
        setUserStronghold({ ...userStronghold, stronghold_type: type });
    }
    
    function handleStrongholdClassChange(strongholdClass: string) {
        setUserStronghold({...userStronghold, stronghold_class: strongholdClass})
    }
    
    function handleStrongholdLevelChange(level: number) {
        setUserStronghold({ ...userStronghold, stronghold_level: level });
    }
    
    function handleOwnerNameChange(e: { target: { value: string } }) {
        setUserStronghold({
            ...userStronghold,
            owner_name: e.target.value,
        });
    }
    
    function handleStrongholdNameChange(e: { target: { value: string } }) {
        setUserStronghold({
            ...userStronghold,
            stronghold_name: e.target.value,
        });
    }

    //DATA FETCHING

    async function fetchStrongholdTypes() {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/strongholds/types`
          );
    
          if (!res.ok) {
            throw new Error("Could not fetch data");
          };
    
          const data = await res.json();
          // console.log(data.data);
          setStrongholdTypes(data.data);
        } catch (err) {
          console.log(err.message);
        } finally {
          setLoading(false);
        }
    }

    async function fetchStrongholdClasses() {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/strongholds/classes/list`
          );
    
          if(!res.ok) {
            throw new Error("Could not fetch data");
          }
    
          const data = await res.json();
          console.log(data.data);
          setStrongholdClasses(data.data);
        } catch (err) {
          console.log(err.message);
        } finally {
          setLoading(false)
        }
    };

    async function fetchStrongholdTypeFeatures(){
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/strongholds/types/features`
            );

            if(!res.ok) {
                throw new Error("Could not fetch data");
            }

            const data = await res.json();
            setTypeFeatures(data.data);
        } catch (err) {
            console.log(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function fetchStrongholdTypeStats(){
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/strongholds/types/stats`
            );

            if(!res.ok) {
                throw new Error("Could not fetch data");
            }

            const data = await res.json();
            setTypeStats(data.data[0])
        } catch (err) {
            console.log(err.message);
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit() {
        setLoading(true);
        setDisplayModal(true);
  
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/strongholds/create`,
            {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify(userStronghold),
            }
          );
    
          if (!res.ok) {
            throw new Error("Error: Could not create stronghold");
          }
    
          //if success, will create message
          const data = await res.json();
          console.log(data);
          //create message modal, with buttons which either - return to list of strongholds or navigates to created stronghold page
          if (data.id) {
            setStrongholdId(data.id);
          }
        } catch (err) {
          console.log(err.message);
        } finally {
          setLoading(false);
        }
      }

    // DYNAMIC RENDERING

    function renderIntro(){
        switch(progress){
            case 1:
                return <p className={styles.introText}>choose a stronghold type</p>;
            case 2:
                return <p className={styles.introText}>choose your ruler</p>;
            case 3:
                return <p className={styles.introText}>set your stronghold&apos;s level</p>;
            case 4:
                return <p className={styles.introText}>give it a name</p>
        }
    }

    function renderContent(){
        switch(progress){
            case 1:
                return <div className={styles.content}>
                    <div className={styles.textContainer}>
                        <p className={styles.text}>
                            This determines your stronghold&apos;s stats, size and cost, as well as it&apos;s core features.
                        </p>
                    </div>
                    <div className={styles.buttonContainer}>
                        {strongholdTypes.map((item) => {
                            return (
                                <button
                                    onClick={() => handleStrongholdTypeChange(item.type_name)}
                                    key={item.id}
                                    className={`${styles.button} ${userStronghold.stronghold_type == item.type_name ? styles.activeButton : ""}`}
                                >
                                    {item.type_name}
                                </button>
                            );
                        })}
                    </div>
                </div>;
            case 2:
                return <div className={styles.content}>
                    <div className={styles.textContainer}>
                        <p className={styles.text}>
                            The name of the character who rules over this demesne.
                        </p>
                        <input
                            className={styles.input}
                            placeholder="enter a name..."
                            type="text"
                            name="owner_name"
                            value={userStronghold.owner_name}
                            onChange={handleOwnerNameChange}
                        />
                    </div>
                    <div className={styles.buttonContainer}>
                        <p className={styles.extraText}>
                            The ruler&apos;s class. Every stronghold improves a class&apos;s signature feature.
                        </p>
                        <div className={styles.classButtonsList}>
                            {strongholdClasses.map((item) => {
                                return (
                                <button
                                    onClick={() => handleStrongholdClassChange(item.name)}
                                    key={item.id}
                                    className={`${styles.button} ${styles.classButton} ${userStronghold.stronghold_class == item.name ? styles.activeButton : ""}`}
                                >
                                    {item.name}
                                </button>
                                );
                            })}
                        </div>
                    </div>
                </div>;
            case 3:
                return <div className={styles.content}>
                    <div className={styles.textContainer}>
                        <p className={styles.text}>
                            Choose the starting level of the stronghold. 
                        </p>
                        <div className={styles.levelButtonsList}>
                            {levels.map((item) => {
                                return (
                                    <button
                                    onClick={() => handleStrongholdLevelChange(item)}
                                    key={item}
                                    className={`${styles.button} ${styles.levelButton} ${userStronghold.stronghold_level == item ? styles.activeButton : ""}`}
                                    >
                                    {item}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <p className={styles.extraText}>
                            How was this stronghold acquired? Changes initial build time and cost.
                        </p>
                        {acquisitionTypes.map((item, index) => {
                            return (
                                <button
                                    onClick={() => setActiveAcquisitionType(item)}
                                    key={index}
                                    className={`${styles.button} ${styles.acquisitionButton} ${item.type == activeAcquisitionType.type ? styles.activeButton : ""}`}    
                                >
                                    {item.displayName}
                                </button>
                            )
                        })}
                    </div>
                    
                </div>
            case 4:
                return <div className={styles.content}>
                    <div className={styles.textContainer}>
                        <p className={styles.text}>
                            Something evocative and cool.
                        </p>
                        <input
                            className={styles.input}
                            placeholder="enter a name..."
                            type="text"
                            name="stronghold_name"
                            value={userStronghold.stronghold_name}
                            onChange={handleStrongholdNameChange}
                        />
                    </div>
                    <div className={styles.buttonContainer}>
                        <p className={styles.extraText}>You can edit all of these details later. Create your stronghold and enjoy!</p>
                    </div>
                </div>
            default:
                return <p>default</p>;
        };
    };

    function renderInfoCard(){
        switch(progress){
            case 1:
                        return <div className={styles.infoCard}>
                            <div className={styles.titleContainer}>
                                <p className={styles.title}>the {userStronghold.stronghold_type}</p>
                                {strongholdTypes.map((item, index) =>
                                    item.type_name == userStronghold.stronghold_type ?
                                    <p key={index} className={styles.summary}>
                                        {item.type_description}
                                    </p> 
                                    : null
                                )}
                            </div>
                            <div className={styles.statsContainer}>
                                <p className={styles.containerTitle}>stats</p>
                                <div className={styles.stat}>
                                    <p>Size</p>
                                    <p>{userStronghold.stronghold_type == "establishment" || userStronghold.stronghold_type == "castle" ? "-" : `d${typeStats.stats[userStronghold.stronghold_type]?.level1?.size}`}</p>
                                </div>
                                <div className={styles.stat}>
                                    <p>Toughness</p>
                                    <p>{userStronghold.stronghold_type == "establishment" || userStronghold.stronghold_type == "castle" ? "-" : `${typeStats.stats[userStronghold.stronghold_type]?.level1?.toughness}`}</p>
                                </div>
                                <div className={styles.stat}>
                                    <p>Unit Morale Bonus</p>
                                    <p>{userStronghold.stronghold_type == "establishment" || userStronghold.stronghold_type == "castle" ? "-" : `+${typeStats.stats[userStronghold.stronghold_type]?.level1?.fortificationBonus}/Level`}</p>
                                </div>
                            </div>
                            <div className={styles.featuresContainer}>
                                <p className={styles.containerTitle}>features</p>
                                {typeFeatures.map((item,index) =>
                                    item.typeName == userStronghold.stronghold_type ?
                                        <div key={index} className={styles.feature}>
                                            <p className={styles.name}>{item.featureName}</p>
                                            <p className={styles.description}>{item.featureDescription}</p>
                                        </div> 
                                        : null
                                    )}
                            </div>
                        </div>
            case 2:
                return <div className={styles.infoCard}>
                    {strongholdClasses.map((item, index) => item.name === userStronghold.stronghold_class ? 
                        <div key={index} className={styles.titleContainer}>
                            <div className={styles.title}>The {item.name}'s {item.strongholdName}</div>
                            <div className={styles.summary}>{item.strongholdDescription}</div>
                        </div>
                         : null)}
                        <div className={styles.classFeaturesContainer}>
                            {strongholdClasses.map((item,index) => 
                                item.name == userStronghold.stronghold_class ?
                                <div className={styles.innerContainer} key={index}>
                                    <section className={styles.section}>
                                        <div className={styles.sectionHeader}>class feature improvement</div>
                                        <div className={styles.subHeader}>{item.featureImprovement.name}</div>
                                        <div className={styles.text}>{item.featureImprovement.description}</div>
                                        <div className={styles.text}>{item.featureImprovement.restriction}</div>
                                        <br/>
                                    </section>
                                    <section className={styles.section}>
                                        <div className={styles.sectionHeader}>demesne effects</div>
                                        {item.demesneEffects.map((effect,index) =>
                                            <div className={styles.subSection} key={index}>
                                                <div className={styles.text}>{effect.description}</div>
                                                <br/>
                                            </div>
                                        )}
                                    </section>
                                    <section className={styles.section}>
                                        <div className={styles.sectionHeader}>stronghold actions</div>
                                        
                                        {item.strongholdActions.map((action,index) =>
                                            <div className={styles.subSection} key={index}>
                                                <div className={styles.subHeader}>{action.name}</div>
                                                <div className={styles.text}>{action.description}</div>
                                                <br/>
                                            </div>
                                        )}
                                    </section>
                                </div>
                                : null
                            )}
                        </div>
                </div>;
            case 3: 
                return <div className={styles.infoCard}>
                    <div className={styles.titleContainer}>
                        <p className={styles.summary}>Let the party know how much time and gold it will take</p>
                    </div>
                    <section className={styles.levelStatsContainer}>
                        <p className={styles.containerTitle}>stats</p>
                        <div className={styles.levelStat}>
                            <p>Size</p>
                            <div className={styles.numberContainer}>
                                <p>{userStronghold.stronghold_type == "establishment" || userStronghold.stronghold_type == "castle" ? "-" : `d${typeStats.stats[userStronghold.stronghold_type]?.[`level${userStronghold.stronghold_level}`]?.size}`}</p>
                                <p className={styles.bonus}>{userStronghold.stronghold_type == "establishment" || userStronghold.stronghold_type == "castle" ? null : `+${typeStats.stats[userStronghold.stronghold_type]?.[`level${userStronghold.stronghold_level}`]?.size - typeStats.stats[userStronghold.stronghold_type]?.level1?.size}` }</p>
                        </div>
                            </div>
                        <div className={styles.levelStat}>
                            <p>Toughness</p>
                            <div className={styles.numberContainer}>
                                <p>{userStronghold.stronghold_type == "establishment" || userStronghold.stronghold_type == "castle" ? "-" : `${typeStats.stats[userStronghold.stronghold_type]?.[`level${userStronghold.stronghold_level}`]?.toughness}`}</p>
                                <p className={styles.bonus}>{userStronghold.stronghold_type == "establishment" || userStronghold.stronghold_type == "castle" ? null : `+${typeStats.stats[userStronghold.stronghold_type]?.[`level${userStronghold.stronghold_level}`]?.toughness - typeStats.stats[userStronghold.stronghold_type]?.level1?.toughness}` }</p>
                            </div>
                        </div>
                        <div className={styles.levelStat}>
                            <p>Unit Morale Bonus</p>
                            <div className={styles.numberContainer}>
                                <p>{userStronghold.stronghold_type == "establishment" || userStronghold.stronghold_type == "castle" ? "-" : `+${typeStats.stats[userStronghold.stronghold_type]?.[`level${userStronghold.stronghold_level}`]?.fortificationBonus}`}</p>
                                <p className={styles.bonus}>{userStronghold.stronghold_type == "establishment" || userStronghold.stronghold_type == "castle" ? null : `+${typeStats.stats[userStronghold.stronghold_type]?.[`level${userStronghold.stronghold_level}`]?.fortificationBonus - typeStats.stats[userStronghold.stronghold_type]?.level1?.fortificationBonus}` }</p>
                            </div>
                        </div>
                    </section>
                    <section className={styles.acquisitionContainer}>
                        <p className={styles.containerTitle}>Acquisition: {activeAcquisitionType.displayName}</p>
                        <p className={styles.acquisitionText}>{activeAcquisitionType.description}</p>
                        <p className={styles.acquisitionText}>{activeAcquisitionType.multiplierText}</p>
                    </section>
                    <section className={styles.constructionContainer}>
                        <p className={styles.containerTitle}>construction costs</p>
                        <div className={styles.levelStat}>
                            <p>Cost To Build</p>
                            <div className={styles.numberContainer}>
                                <p>{typeStats.stats[userStronghold.stronghold_type]?.[`level${userStronghold.stronghold_level}`]?.costToBuild * activeAcquisitionType.multiplier} gp</p>
                                <p className={styles.bonus}>{userStronghold.stronghold_type == "establishment" || userStronghold.stronghold_type == "castle" ? null : `x${activeAcquisitionType.multiplier}` }</p>
                            </div>
                        </div>
                        <div className={styles.levelStat}>
                            <p>Time to Build</p>
                            <div className={styles.numberContainer}>
                                <p>{typeStats.stats[userStronghold.stronghold_type]?.[`level${userStronghold.stronghold_level}`]?.timeToBuild * activeAcquisitionType.multiplier} days</p>
                                <p className={styles.bonus}>{userStronghold.stronghold_type == "establishment" || userStronghold.stronghold_type == "castle" ? null : `x${activeAcquisitionType.multiplier}` }</p>
                            </div>
                        </div>
                    </section>
                </div>;
            case 4:
                return <div>4</div>;
            default:
                return <div>default</div>;
        };
    }

    // USE EFFECTS

    //redirect user to login/signup page if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
        router.push("/login");
        } else {
        fetchStrongholdTypes();
        fetchStrongholdClasses();
        fetchStrongholdTypeStats();
        fetchStrongholdTypeFeatures();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if(progress == 4){
            if (userStronghold.owner_name !== "" && userStronghold.stronghold_name !== ""){
                setIsButtonDisabled(false);
            } else{
                setIsButtonDisabled(true);
            }
        }else{
            setIsButtonDisabled(false);
        }
    },[progress, userStronghold])

    return <div className={styles.container}>
        <section className={styles.card}>
            <section className={styles.cardHeader}>stronghold creator</section>
            <section className={styles.cardBody}>
                <section className={styles.cardIntro}>
                    {renderIntro()}
                </section>
                <section className={styles.cardContent}>
                    {renderContent()}
                </section>
                <section className={styles.cardFooter}>
                    <button className={styles.button} onClick={progress > 1 ? decrementProgress : handleNavigate}>{progress > 1 ? "back" : "cancel"}</button>
                    <section className={styles.progressBar}>
                        <div className={`${styles.progressIcon} ${progress >= 1 ? styles.progressMark : ""}`}></div>
                        <div className={`${styles.progressIcon} ${progress >= 2 ? styles.progressMark : ""}`}></div>
                        <div className={`${styles.progressIcon} ${progress >= 3 ? styles.progressMark : ""}`}></div>
                        <div className={`${styles.progressIcon} ${progress >= 4 ? styles.progressMark : ""}`}></div>
                    </section>
                    <span
                        className={styles.createButtonContainer}
                        onMouseEnter={isButtonDisabled ? () => setHovered(true) : () =>  setHovered(false)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <button 
                            className={`${styles.createButton} ${isButtonDisabled ? styles.disabledButton : ""}`} 
                            onClick={progress == 4 ? handleSubmit : incrementProgress}
                            disabled={isButtonDisabled}

                        >
                            <Tooltip visible={hovered}>Some fields are missing</Tooltip>
                            {progress == 4 ? "create" : "next"}
                        </button>
                    </span>
                </section>
            </section>
        </section>
        <section className={styles.card}>
            <section className={styles.cardHeader}>information</section>
            <section className={styles.cardBody}>
                {renderInfoCard()}
            </section>
        </section>
        {displayModal ? (
        <CreateItemModal loading={loading} strongholdId={strongholdId}/>
      ) : null}
    </div>
}