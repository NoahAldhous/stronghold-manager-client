import styles from "./styles.module.scss";

type StrongholdFeaturesType = {
    activeButton : {
        category: string,
        subCategory: string
    },
    strongholdActions: {
        name: string,
        description: string
    }[],
    demesneEffects: {
        description: string
    }[],
    typeBenefits: {
        title: string,
        description: string
    }[],
    classFeatureImprovement: {
        name: string,
        description: string,
        restriction: string
    },
    strongholdType: string,
    characterClass: string;
}

export default function StrongholdFeatures({
    activeButton, 
    strongholdActions,
    demesneEffects,
    typeBenefits,
    classFeatureImprovement,
    strongholdType,
    characterClass
    }:StrongholdFeaturesType){

    //pass prop activeButton from parent
    //switch statement that renders different elements-
    //category and subcategory- switches inside switch
    //return dynamic elements based on each one.

    function renderText(){
        switch(activeButton.category) {
            case "stronghold":
                switch(activeButton.subCategory){
                    case "all":
                        return <>
                            <p className={styles.rulesHeader}>stronghold actions</p>
                            <p className={styles.rulesText}>{`On initiative count 20 (losing initiative ties), the ${characterClass} can take a stronghold action with one of the following effects. They must be in the same hex or province as their stronghold and cannot use the same effect again until after a short or long rest.`}</p>
                            {strongholdActions.map((action, index) =>
                                <div key={index} className={styles.textItem}>
                                    <p className={styles.itemName}>{action.name}</p>
                                    <p className={styles.itemInfo}>{action.description}</p>
                                </div>
                            )}
                            <p className={styles.rulesHeader}>demesne effects</p>
                            <p className={styles.rulesText}>{`The ${characterClass}'s stronghold creates one or more of the following effects at the GM's discretion.`}</p>
                            {demesneEffects.map((effect, index) =>
                                <div key={index} className={styles.textItem}>
                                    <p className={styles.itemInfo}>{effect.description}</p>
                                </div>
                            )}
                            <p className={styles.rulesHeader}>{strongholdType} benefits</p>
                            { typeBenefits.map((feature, index) =>
                                <div key={index} className={styles.textItem}>
                                    <p className={styles.itemName}>{feature.title}</p>
                                    <p className={styles.itemInfo}>{feature.description}</p>
                                </div>
                            )}
                            <p className={styles.rulesHeader}>class feature improvement</p>
                            <div className={styles.textItem}>
                            <p className={styles.itemName}>{classFeatureImprovement.name}</p>
                            <p className={styles.itemInfo}>{classFeatureImprovement.description}</p>
                            <p className={styles.itemInfo}>{classFeatureImprovement.restriction}</p>
                        </div>
                        </>
                    case "stronghold actions":
                        return <>
                            <p className={styles.rulesText}>{`On initiative count 20 (losing initiative ties), the ${characterClass} can take a stronghold action with one of the following effects. They must be in the same hex or province as their stronghold and cannot use the same effect again until after a short or long rest.`}</p>
                            {strongholdActions.map((action, index) =>
                                <div key={index} className={styles.textItem}>
                                    <p className={styles.itemName}>{action.name}</p>
                                    <p className={styles.itemInfo}>{action.description}</p>
                                </div>
                            )}
                        </>
                    case "demesne effects":
                        return <>
                            <p className={styles.rulesText}>{`The ${characterClass}'s stronghold creates one or more of the following effects at the GM's discretion.`}</p>
                            {demesneEffects.map((effect, index) =>
                                <div key={index} className={styles.textItem}>
                                    <p className={styles.itemInfo}>{effect.description}</p>
                                </div>
                            )}
                        </>
                    case `${strongholdType} benefits`:
                        return (typeBenefits.map((feature, index) =>
                            <div key={index} className={styles.textItem}>
                                <p className={styles.itemName}>{feature.title}</p>
                                <p className={styles.itemInfo}>{feature.description}</p>
                            </div>
                        ))
                    case "class feature improvement":
                        return <div className={styles.textItem}>
                            <p className={styles.itemName}>{classFeatureImprovement.name}</p>
                            <p className={styles.itemInfo}>{classFeatureImprovement.description}</p>
                            <p className={styles.itemInfo}>{classFeatureImprovement.restriction}</p>
                        </div>
                }
            case "units":
                return <p>units</p>;
            case "artisans":
                return <p>artisans</p>;
            case "followers":
                return <p>followers</p>;
            default:
                return <p>nothing selected!</p>
        }
    }

    return <section className={styles.featuresContainer}>
        {renderText()}
    </section>
}