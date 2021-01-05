import React, { useState, useEffect } from "react";

const Editable = ({
    childRef,
    text,
    type,
    placeholder,
    children,
    parent,
    ...props
}) => {

    const [isEditing, setEditing] = useState(false);

    useEffect(() => {
        if (childRef && childRef.current && isEditing === true) {
            childRef.current.focus();
        }
    }, [isEditing, childRef]);

    const handleKeyDown = (e, type) => {
        const { key } = e;
        console.log(key)
        const keys = ["Escape", "Tab"];
        const enterKey = "Enter";
        const allKeys = [...keys, enterKey]; // All keys array

        if (
            (type === "textarea" && keys.indexOf(key) > -1) ||
            (type !== "textarea" && allKeys.indexOf(key) > -1)
        ) {
            setEditing(false);
        }
    };

    return (
        <section {...props}>
            {isEditing ? (
                <div
                    onBlur={() => setEditing(false)}
                    onKeyDown={e => handleKeyDown(e, type)}
                >
                    {children}
                </div>
            ) : (
                    <div
                        onClick={() => setEditing(true)}
                    >
                        {parent === "options_page" ? (
                            <p className="add">+</p>
                        ) : (
                                <span>
                                    {text || placeholder}
                                </span>
                            )}
                    </div>
                )}
        </section>
    );
}

export default Editable;